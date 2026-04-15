import jsPDF from "jspdf";

export const exportStyledPDF = (chatList) => {
  // Initialize jsPDF (default is 'mm', 'a4')
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const maxBubbleWidth = pageWidth - margin * 4; // Max width to ensure it looks like a chat
  
  let y = 30; // Starting Y coordinate below the header

  // Helper function to draw the page header
  const addHeader = () => {
    doc.setFillColor(248, 250, 252); // Very light gray header bg
    doc.rect(0, 0, pageWidth, 20, "F");
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Dark slate
    doc.setFont("helvetica", "bold");
    doc.text("PromptixGPT Chat Export", pageWidth / 2, 12, { align: "center" });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(new Date().toLocaleString(), pageWidth / 2, 17, { align: "center" });
  };

  // Helper function to draw a single text/code block bubble
  const drawBubbleBlock = (x, y, width, lines, isUser, isCode, padding, lineHeight) => {
    const height = (lines.length * lineHeight) + (padding * 2);

    // Styling based on block type
    if (isCode) {
      doc.setFillColor(30, 41, 59); // Dark slate for code blocks
      doc.setTextColor(226, 232, 240); // Very light gray text
    } else if (isUser) {
      doc.setFillColor(37, 99, 235); // Blue for user
      doc.setTextColor(255, 255, 255); // White text
    } else {
      doc.setFillColor(243, 244, 246); // Light gray for bot
      doc.setTextColor(31, 41, 55); // Dark gray text
    }

    // Draw rounded background
    doc.roundedRect(x, y, width, height, 3, 3, "F");

    // Draw text (y + padding + 3.5 adjusts for jsPDF's baseline positioning)
    doc.text(lines, x + padding, y + padding + 3.5);
  };

  // Add the first page header
  addHeader();

  // Iterate through all messages
  chatList.forEach((msg) => {
    const isUser = msg.role === "user";
    
    // Split message by triple backticks to isolate code blocks
    // Even indices are standard text, odd indices are code blocks
    const parts = msg.content.split("```");

    parts.forEach((part, index) => {
      if (!part.trim()) return; // Skip empty segments

      const isCode = index % 2 !== 0;
      let content = part;

      if (isCode) {
        // Strip the language identifier (e.g., "javascript\n") from the start of the code block
        content = content.replace(/^[\w-]+\s*\r?\n/i, "");
      } else {
        content = content.trim();
      }

      // Configure font based on block type
      doc.setFont(isCode ? "courier" : "helvetica", "normal");
      doc.setFontSize(isCode ? 9 : 10);

      // Split text to fit max width
      const lines = doc.splitTextToSize(content, maxBubbleWidth);

      // Calculate the true width of the bubble (shrink-wraps short text)
      let maxLineWidth = 0;
      lines.forEach((l) => {
        const w = doc.getTextWidth(l);
        if (w > maxLineWidth) maxLineWidth = w;
      });

      const padding = 6;
      const lineHeight = isCode ? 4.5 : 5; // Code lines are slightly closer together
      const bubbleWidth = Math.min(maxBubbleWidth, maxLineWidth) + (padding * 2);

      // Positioning: User on right, Bot/Code on left
      const x = isUser ? pageWidth - bubbleWidth - margin : margin;

      // --- Pagination & Rendering ---
      let currentLines = [];
      let currentY = y;

      // Process line-by-line to allow page breaks INSIDE long messages/code blocks
      for (let i = 0; i < lines.length; i++) {
        const potentialHeight = (currentLines.length * lineHeight) + lineHeight + (padding * 2);
        
        // If adding this line pushes us off the page
        if (currentY + potentialHeight > pageHeight - margin) {
          // Draw what we have so far ONLY if there are actually lines to draw
          if (currentLines.length > 0) {
            drawBubbleBlock(x, currentY, bubbleWidth, currentLines, isUser, isCode, padding, lineHeight);
          }
          
          // Create new page
          doc.addPage();
          addHeader();
          currentY = 30; // Reset Y to top of new page
          y = 30;
          currentLines = [];
        }
        currentLines.push(lines[i]);
      }

      // Draw remaining lines for this block
      if (currentLines.length > 0) {
        drawBubbleBlock(x, currentY, bubbleWidth, currentLines, isUser, isCode, padding, lineHeight);
        y += (currentLines.length * lineHeight) + (padding * 2) + 2; // +2 for tiny gap between parts of same message
      }
    });

    y += 8; // Larger gap between different messages
  });

  doc.save("PromptixGPT-chat.pdf");
};
import 'dotenv/config';

const getOpenAIApiResponse = async(message) =>{
    const options = {
        method: "POST",
        headers:{
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body : JSON.stringify({
            model: "gpt-4.1-nano-2025-04-14",
            messages : [{
                role: "user",
                content : message
            }]
        })
    };
    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();
        return (data.choices[0].message.content);
    }catch(err){
        console.error("Error:", err);
    }
}

export default getOpenAIApiResponse;
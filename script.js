document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chat-messages");
    const userInput = document.getElementById("user-input");

    function addUserMessage(message) {
        const userMessage = document.createElement("div");
        userMessage.classList.add("message-container", "user-message-container");
        userMessage.innerHTML = `<div class="message user-message">${message}</div>`;
        chatMessages.appendChild(userMessage);
    }

    function addLoadingMessage() {
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("message-container", "bot-message-container", "loading");
        loadingMessage.innerHTML = '<div class="message bot-message loading">Generating response...</div>';
        chatMessages.appendChild(loadingMessage);

        // Add dot animation
        const dotAnimation = document.createElement("span");
        dotAnimation.classList.add("dot-animation");
        loadingMessage.querySelector(".bot-message").appendChild(dotAnimation);
    }

    async function removeLoadingMessage() {
        const loadingMessage = document.querySelector(".loading");
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    async function addBotMessage(message) {
        removeLoadingMessage(); // Remove the loading animation
        const botMessageContainer = document.createElement("div");
        botMessageContainer.classList.add("message-container", "bot-message-container");
        chatMessages.appendChild(botMessageContainer);
    
        const botMessage = document.createElement("div");
        botMessage.classList.add("message", "bot-message");
        botMessageContainer.appendChild(botMessage);
    
        const typingAnimation = document.createElement("span");
        typingAnimation.classList.add("typing-animation");
        botMessage.appendChild(typingAnimation);
    

        const delayBetweenCharacters = 20; 
    
    
        if (message) {
            for (let i = 0; i < message.length; i++) {
                setTimeout(() => {
                    const typedMessage = message.slice(0, i + 1);
                    typingAnimation.textContent = typedMessage;
    
                    // Add a caret
                    if (i === message.length - 1) {
                        typingAnimation.innerHTML += "<span class='caret'>|</span>";
                    }
                }, i * delayBetweenCharacters); 
            }
    
            setTimeout(() => {
                const caret = botMessage.querySelector(".caret");
                if (caret) {
                    caret.style.display = "none";
                }
            }, message.length * delayBetweenCharacters + 1000); 
        }
    }
    

    async function handleUserInput() {
        const userText = userInput.value.trim();
        if (userText !== "") {
            addUserMessage(userText);
            userInput.value = "";

    
            addLoadingMessage(); 
            const response = await sendUserMessage(userText);
            addBotMessage(response); 
        }
    }

    async function sendUserMessage(message) {
        try {
            const response = await fetch("/generate-completion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user_message: message }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error:", error);
            return "An error occurred.";
        }
    }

    document.getElementById("send-button").addEventListener("click", handleUserInput);
    userInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });
});

import openai
import requests
from flask import Flask, request, jsonify, render_template

app = Flask(__name__)


openai.api_key = None
conversation_history = []


openai.api_base = 'https://api.pawan.krd/v1'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate-completion', methods=['POST'])
def generate_completion():
    try:
        data = request.json
        user_message = data["user_message"]
        
        if openai.api_key is None:
            return jsonify({"error": "API key is not set. Please log in."})

     
        if len(conversation_history) == 0:
            conversation_history.append({
                "role": "system",
                "content": "You are Edison Labs Smartbot, a large language model trained by Gurneet Singh in Edison Labs.\nYour goal is to help the user and answer the user's questions correctly.\nCarefully heed the user's instructions."
            })

    
        conversation_history.append({"role": "user", "content": user_message})

   
        completion = openai.ChatCompletion.create(
            model="pai-001",
            messages=conversation_history  
        )
        
        response = completion.choices[0].message['content']
        
    
        conversation_history.append({"role": "assistant", "content": response})

        return jsonify({"response": response})
    
    except openai.error.AuthenticationError as e:
        if 'Your API key is not allowed to be used from this IP address' in str(e):
            return jsonify({"response": "Reset your IP address from Pawan.krd discord using /resetip command"})
        else:
            return jsonify({"error": str(e)})
    
    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/submit-form', methods=['POST'])
def submit_form():
    try:
        data = request.json
        username = data.get("username")
        apikey = data.get("apikey")


        openai.api_key = apikey
        return jsonify({"success": True})

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/reset-ip', methods=['POST'])
def reset_ip():
    try:
        data = request.json
        apikey = data.get("apikey")

 
        response = requests.post('https://api.pawan.krd/resetip', headers={'Authorization': f'Bearer {apikey}'})

        if response.ok:
            return jsonify({"success": True})
        else:
            return jsonify({"error": "Failed to reset IP address."})

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route('/app')
def chat_app():
    if openai.api_key is not None:
        return render_template('app.html')
    else:
        return "Please log in to set your API key."

if __name__ == '__main__':
    app.run(debug=True)

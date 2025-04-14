def chat():
    user_message = request.json.get("message", "")
    try:
        response = model.generate_content(user_message)
        if response and response.text:
            formatted_response = format_response(response.text)
        else:
            formatted_response = "I'm sorry, I couldn't understand that."
        return jsonify({"response": formatted_response})
    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})
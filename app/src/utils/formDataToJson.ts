export function formDataToJson(formData: FormData): Record<string, any> {
    const json: Record<string, any> = {};

    formData.forEach((value, key) => {
        // Check if the key already exists in the JSON object
        if (json.hasOwnProperty(key)) {
            // If it does, convert the value to an array
            if (!Array.isArray(json[key])) {
                json[key] = [json[key]];
            }
            json[key].push(value);
        } else {
            json[key] = value;
        }
    });

    return json;
}
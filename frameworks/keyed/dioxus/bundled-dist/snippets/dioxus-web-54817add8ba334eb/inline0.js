
    export function get_form_data(form) {
        let values = new Map();
        const formData = new FormData(form);

        for (let name of formData.keys()) {
            values.set(name, formData.getAll(name));
        }

        return values;
    }

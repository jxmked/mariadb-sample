import conn from './config';

export default ({ name, color, id }: CatInterface): Promise<{ [key: string]: any }> => {

    return new Promise<{ [key: string]: any }>((res, rej) => {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("color", color);
        formData.append("mode", "modify");
        formData.append("id", String(id));

        const xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState != 4) return;

            if (xhr.status == 200) {
                res(JSON.parse(xhr.responseText));
                return;
            }

            rej(xhr.status);
        });

        xhr.addEventListener("error", (err) => rej(err));
        xhr.open('POST', conn['host'], true);
        xhr.send(formData);
    });
}

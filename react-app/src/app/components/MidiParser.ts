export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
};

export const readFile = (filePath: string): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onprogress = (event) => console.log('Reading progress:', event.loaded, 'bytes read');
            reader.onload = (event) => {
            if (event.target) {
                resolve(event.target.result as ArrayBuffer);
            } else {
                reject(new Error('FileReader event target is null'));
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch file. Status code: ${response.status}`);
                }
                return response.blob();
            })
        .then(blob => reader.readAsArrayBuffer(blob))
        .catch(error => reject(error));
    });
};
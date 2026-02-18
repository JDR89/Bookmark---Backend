import { v4 as uuid } from "uuid"

export const fileNamer = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if (!file) return callback(new Error('Archivo vacío'), false);

    // 1. Obtenemos la extensión después del último punto
    const fileExtension = file.mimetype.split('/')[1]; // Opción A: Usar el tipo MIME (más seguro)
    // O Opción B: file.originalname.split('.').pop();

    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

    if (!validExtensions.includes(fileExtension)) {
        return callback(new Error('Extensión no válida'), false);
    }

    // 2. Generamos un nombre único (usar UUID es mejor, pero Date.now() funciona)
    const fileName = `${uuid()}.${fileExtension}`;

    callback(null, fileName);
}
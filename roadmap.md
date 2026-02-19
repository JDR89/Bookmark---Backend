# Roadmap: Proyecto Bookmarks

Este documento detalla los pasos para transformar la base actual en el sistema de organización jerárquica solicitado.

## Objetivo Central
Crear una estructura de 3 niveles para organizar información:
1.  **Workspaces (Espacios de Trabajo)**: Categorías generales (Ej: "Trabajo", "Hobby").
2.  **Colecciones**: Carpetas dentro de espacios (Ej: "Recetas", "Documentación").
3.  **Bookmarks**: Los enlaces finales guardados.

---

## 📅 Plan de Acción

### Fase 1: Limpieza del Proyecto Base (🧹)
El proyecto actual está basado en "Productos". Debemos eliminar esa lógica para dar lugar a la nueva estructura.

1.  **Limpiar Entidad User**:
    *   Ir a `src/auth/entities/user.entity.ts`.
    *   Eliminar la relación `@OneToMany(() => Product, ...)` y la importación de `Product`.
2.  **Eliminar Módulo Products**:
    *   Borrar la carpeta completa `src/products`.
    *   Eliminar `ProductsModule` de los imports en `src/app.module.ts`.
3.  **Limpiar Seed**:
    *   Eliminar la lógica de inserción de productos en `src/seed/seed.service.ts` (si existe).

---

### Fase 2: Construcción de la Jerarquía (🏗️)
Crearemos los recursos siguiendo el orden de dependencia: Padre -> Hijo -> Nieto.

#### 1. Nivel Superior: Workspaces
*   **Generar Recurso**: `nest g resource workspaces --no-spec`
*   **Entidad (`workspace.entity.ts`)**:
    *   `id`: UUID.
    *   `name`: String (Ej: "Cocina").
    *   `slug`: String (para URLs amigables, único por usuario si se desea).
    *   `isActive`: Bool.
    *   `user`: Relación `@ManyToOne` con la entidad `User`. (Un usuario tiene muchos workspaces).
*   **DTOs**: Validar `name` obligatorio.

#### 2. Nivel Intermedio: Colecciones (Collections)
*   **Generar Recurso**: `nest g resource collections --no-spec`
*   **Entidad (`collection.entity.ts`)**:
    *   `id`: UUID.
    *   `name`: String (Ej: "Postres").
    *   `workspace`: Relación `@ManyToOne` con la entidad `Workspace`. (Un workspace tiene muchas colecciones).
*   **DTOs**: Validar `name` y `workspaceId`.

#### 3. Nivel Final: Bookmarks
*   **Generar Recurso**: `nest g resource bookmarks --no-spec`
*   **Entidad (`bookmark.entity.ts`)**:
    *   `id`: UUID.
    *   `title`: String.
    *   `url`: String.
    *   `description`: String (opcional).
    *   `image`: String (opcional, para preview).
    *   `collection`: Relación `@ManyToOne` con la entidad `Collection`. (Una colección tiene muchos bookmarks).
*   **DTOs**: Validar `url` (IsUrl), `title`, y `collectionId`.

---

### Fase 3: Relaciones y Base de Datos (🔗)
Configurar correctamente TypeORM para que las relaciones funcionen en ambas direcciones y se puedan hacer consultas eficientes.

1.  **Actualizar User**: Agregar `@OneToMany(() => Workspace, ...)` en `user.entity.ts`.
2.  **Actualizar Workspace**: Agregar `@OneToMany(() => Collection, ...)` en `workspace.entity.ts`.
3.  **Actualizar Collection**: Agregar `@OneToMany(() => Bookmark, ...)` en `collection.entity.ts`.

---

### Fase 4: Endpoints y Lógica (⚡)

#### Auth & Seguridad
*   Asegurar que todos los endpoints (excepto login/register) estén protegidos con `@Auth()`.
*   **Regla de Oro (Data Isolation)**: 
    *   Todas las consultas `find` deben incluir `where: { user: { id: user.id } }`.
    *   Todas las operaciones de escritura/borrado deben verificar primero que el recurso pertenezca al usuario (`Ownership Check`).
    *   Un usuario **jamás** debe poder acceder a un Workspace, Collection o Bookmark de otro usuario, ni siquiera coincidiendo IDs.

#### Endpoints Clave
1.  **Workspaces**:
    *   `GET /workspaces`: Devuelve solo los workspaces del usuario logueado.
    *   `POST /workspaces`: Crea un workspace asignando automáticamente el usuario logueado.
2.  **Collections**:
    *   `POST /collections`: Crea una colección. *Validación importante: Verificar que el `workspaceId` pertenezca al usuario.*
    *   `GET /collections/:workspaceId`: Trae todas las colecciones de un workspace específico.
3.  **Bookmarks**:
    *   `POST /bookmarks`: Crea un bookmark. *Validación: Verificar que la `collectionId` pertenezca a un workspace del usuario.*
    *   `GET /bookmarks/:collectionId`: Trae los links de una colección.

---

### Fase 5: Seed (Opcional pero recomendado) 
Actualizar `src/seed` para crear un usuario de prueba con una estructura completa:
*   User: "Test User"
    *   Workspace: "Hobby: Cocina"
        *   Colección: "Postres"
            *   Bookmark: "Receta Volcán de Chocolate"

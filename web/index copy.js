"use strict";

import { booksAPI_auto } from "/js/api/_books.js";
import { messageRenderer } from "/js/renderers/messages.js";
import { galleryRenderer } from "/js/renderers/gallery.js";


async function main() {
    cargarFotos();
}

async function cargarFotos() {
    let galleryContainer = document.querySelector("div.photoContainer");
    try {
        let books = await booksAPI_auto.getAll();
        let cardGallery = galleryRenderer.asCardGallery(books);
        galleryContainer.appendChild(cardGallery);
    } catch (err) {
        messageRenderer.showErrorMessage("Error while loading photos", err);
    }
}

document.addEventListener("DOMContentLoaded", main);
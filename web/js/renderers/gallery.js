import { parseHTML } from "web/js/utils/parseHTML.js";
import { photoRenderer } from "web/js/renderers/photoRenderer.js";

const galleryRenderer = {
    asCardGallery: function (books) {
        let galleryContainer = parseHTML('<div class="photo-gallery"></div>');
        let row = parseHTML('<div class="row"></div>');
        galleryContainer.appendChild(row);

        let counter = 0;
        for (let book of books) {
            let card = photoRenderer.asCard(book);
            row.appendChild(card);
            counter += 1;
            if (counter % 3 === 0) {
                row = parseHTML('<div class="row"></div>');
                galleryContainer.appendChild(row);
            }

        }
        return galleryContainer;
    }
}

export { galleryRenderer };
"use strict";

import { parseHTML } from "/js/utils/parseHTML.js";

const photoRenderer = {
    asCard: function (book) {
        let html = `<div class="col-md-4">
                    <div class="card">
                            <img src="${book.imageUrl}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title text-center">${book.title}</h5>
                            <h6 class="card-title text-center">${book.author}</h6>
                        </div>

                        <div class="row">
                            <a href = create_books.html?bookId=${book.bookId}>
                                <button type="button" class="class btn btn-success" id="button-edit">
                                    <i class="fa fa-edit mr-2"></i>Editar
                                </button>
                            </a>
                        </div>
                    </div>
                </div>`
        let card = parseHTML(html);
        return card;
    }
        
};

export { photoRenderer };


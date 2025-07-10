import { books } from "./book.js";
import { users } from "./user.js";

let COUNT = 12; // for uniq id

function addBook(name, author, ganre, date, rating) {
    const newBook = {
        bookID: COUNT,
        name: name,
        author: author,
        ganre: ganre,
        releaseDate: date,
        rating: rating,
        borrowCount: 0,
        isAvailable: true
    };

    books.push(newBook);
    COUNT++;
};


//i am using userID insted of userName because it is more safer

function borrowBook(userId, bookId) {
    const user = users.findIndex(u => u.userID == userId);
    const book = books.findIndex(b => b.bookID == bookId);
    const borrowDate = new Date();
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(borrowDate.getDate() - 20);

    if (user == -1 || book == -1) {
        console.log("User or Book not found!");
        return;
    }

    const borrowedInfo = {
        bookID: books[book].bookID,
        name: books[book].name,
        genre: books[book].genre,
        borrowDate: twentyDaysAgo
    }

    if (books[book].isAvailable) {
        users[user].borrowedBooks.push(borrowedInfo);
        users[user].currentlyBooks.push(borrowedInfo);
        books[book].borrowCount++;
        users[user].borrowCount = users[user].borrowedBooks.length;
        books[book].isAvailable = false;
        // console.log(users[user].borrowedBooks);
    } else {
        console.log('This book is not evailable for this time');
    }
}

console.log("---borrow book---");
borrowBook(1, 2);

function returnBook(userId, bookId) {
    const user = users.findIndex(u => u.userID == userId);
    const book = books.findIndex(b => b.bookID == bookId);
    const currentlyBook = users[user].currentlyBooks.findIndex(b => b.bookID == bookId);
    const returnDate = new Date();
    const timeDiff = Math.floor((returnDate - users[user].currentlyBooks[currentlyBook].borrowDate) / (1000 * 60 * 60 * 24)); //date subtract returns millisecond and then make it in day. *1000returns second then *60 returns minutes then *60 returns hours and last *24 returns days
    // console.log(borrowedBook);
    // console.log(timeDiff);
    if (user == -1 || book == -1) {
        console.log("User or Book not found!");
        return;
    }

    if (currentlyBook == -1) {
        console.log("This user has not borrowed this book!");
        return;
    }

    books[book].isAvailable = true;
    if (timeDiff > 14) {
        users[user].penaltyPoints += timeDiff - 14;
        users[user].overdueItem.push(books[book]);
        console.log("You overdue to return Book!");
    } else {
        console.log('Thank you for return book on time!');
    }
    users[user].currentlyBooks.slice(currentlyBook, 1);
}
console.log('---return book---');
returnBook(1, 2);

function getTopRatedBooks(limit) {
    const topBooks = books.sort((a, b) => b.rating - a.rating);
    console.log(topBooks.slice(0, limit));
}

function searchBooksBy(param, value) {
    const searchedBooks = books.filter(book => book[param] == value);

    if (searchedBooks.length == 0) {
        console.log('book not found');
    } else {
        console.log(searchedBooks);
    }
}

console.log("---searched books---");
searchBooksBy("genre", "Fantasy");

console.log('---top rated books---');
getTopRatedBooks(4);

function getMostPopularBooks(limit) {
    const popularBooks = books.sort((a, b) => b.borrowCount - a.borrowCount);
    console.log(popularBooks.slice(0, limit));
}

console.log('---popular books---');
getMostPopularBooks(2);

function checkOverdueUsers() {
    const check = users.filter(user => user.overdueItem.length > 0).map(user => {
        return {
            name: user.userName,
            overdue: user.penaltyPoints
        }
    });
    console.log(check);
}

console.log("---check overdue users---");
checkOverdueUsers();

borrowBook(1, 9); //for testing
function recommendBooks(userId) {
    const user = users.findIndex(u => u.userID == userId);
    const userGenres = users[user].borrowedBooks.map(b => b.genre);
    const borrowBooksID = users[user].borrowedBooks.map(b => b.bookID);


    const recommendation = books.filter(book => userGenres.includes(book.genre) && !borrowBooksID.includes(book.bookID)).sort((a, b) => b.rating - a.rating);
    console.log(recommendation);
}
console.log("---recommended books---");
recommendBooks(1);

function removeBook(bookId) {
    const book = books.findIndex(b => b.bookID == bookId);

    if (books[book].isAvailable) {
        books.slice(book, 1);
    } else {
        console.log("This book have someone!");
    }
}

console.log("---remove book---");

function printUserSummary(userId) {
    const user = users.find(u => u.userID == userId);

    return {
        currentlyBorrowed: user.currentlyBooks,
        overdueItems: user.overdueItem,
        penaltyPoints: user.penaltyPoints
    }
}

console.log("---user summary---");
console.log(printUserSummary(1));


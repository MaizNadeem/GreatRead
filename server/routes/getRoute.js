const express = require('express');
const getRoute = express.Router();
const Book = require('../models/Book');
const TopPicks = require('../models/TopPicks');
const Quote = require('../models/Quote');
const Category = require('../models/Category');
const Payment = require('../models/Payment');

getRoute.post('/books', async (req, res) => {
    const { offset, limit, categories, searchTerm } = req.body;
    try {
        let offsetNum = parseInt(offset);
        let limitNum = parseInt(limit);
        let query = Book.find();
        let totalCountQuery = Book.countDocuments();
        let topPicks = await TopPicks.findOne().populate({
            path: 'books',
            model: 'Book'
        }).exec();
        if (searchTerm && searchTerm !== '') {
            topPicks.books = topPicks.books.filter((book) =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const searchRegex = new RegExp(searchTerm, 'i');
            query = query.or([{ title: searchRegex }, { author: searchRegex }]);
            totalCountQuery = totalCountQuery.or([{ title: searchRegex }, { author: searchRegex }]);
        }
        if (categories && categories.length > 0) {
            topPicks.books = topPicks.books.filter((book) =>
                categories.some(category => book.categories.includes(category))
            );
            query = query.where('categories').in(categories);
            totalCountQuery = totalCountQuery.where('categories').in(categories);
        }
        query = query.where('_id').nin(topPicks.books.map(book => book._id));
        if (0 <= offsetNum && offsetNum < topPicks.books.length) {        
            limitNum = limitNum - topPicks.books.length;
        } else {
            offsetNum = offsetNum - topPicks.books.length;
        }
        let books = await query
            .skip(offsetNum)
            .limit(limitNum)
            .exec();
        if (offset == 0) {
            books = [ ...topPicks.books, ...books ];
        }
        const totalCount = await totalCountQuery.exec();
        res.json({
            books,
            totalCount,
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

getRoute.get('/toppicks', async (req, res) => {
    try {
        const topPicks = await TopPicks.findOne().populate({
            path: 'books',
            model: 'Book'
        }).exec();     
        if (!topPicks) {
            return res.status(404).json({ message: 'No top picks found' });
        }
        res.json(topPicks);
    } catch (error) {
        console.error('Error fetching top picks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

getRoute.get('/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find();
        res.json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

getRoute.get('/randomquotes', async (req, res) => {
    try {
        const books = await Book.find({}, 'title quote').exec();
        const shuffledBooks = shuffleArray(books);
        const randomBooks = shuffledBooks.slice(0, 12);
        const response = randomBooks.map((book) => ({
            title: book.title,
            quote: book.quote,
        }));
        res.json(response);
    } catch (error) {
        console.error('Error fetching random quotes:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

getRoute.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find({ bestseller: false });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


async function getRandomBooksByCategoriesFromDB(categories, goal, books) {
    try {
        const filteredBooks = await Book.find({
            categories: { $in: categories },
            _id: { $nin: books.map(book => book._id) }
        });
        const selectedBooks = shuffleArray(filteredBooks).slice(0, goal);

        return selectedBooks;
    } catch (error) {
        console.error('Error fetching books by categories:', error);
        throw new Error('Could not fetch books by categories from the database.');
    }
}

getRoute.post('/getRandomBooks', async (req, res) => {
    const { categories, goal, books } = req.body;
    try {
        const randomBooks = await getRandomBooksByCategoriesFromDB(categories, goal, books);
        res.json(randomBooks);
    } catch (error) {
        console.error('Error fetching random books by categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

getRoute.post('/getPayment', async (req, res) => {
    const { sessionId } = req.body;

    try {
        const payment = await Payment.findById(sessionId).populate({
            path: 'books',
            select: '-notes',
        });
        
        if (!payment.fetchedBefore) {
            payment.fetchedBefore = true;
            await payment.save();
        }

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        if (!payment.success) {
            payment.urls = [];
            return res.json(payment);
        }

        return res.json(payment);
    } catch (error) {
        console.error('Error retrieving payment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = { getRoute };
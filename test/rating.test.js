import { test, after, suite, afterEach } from 'node:test';
import assert from 'assert';
import { getRating, showAllCommentsAndRatings, createReview } from '../controllers/ratingController';
import { addCommentAndRating, getAllCommentsAndRatings } from '../db/ratings_db';
import sql from '../config/dbconfig';

suite('Rating Controller Tests', () => {
    test('getRating should return product details for a valid ID', async () => {
        const req = { params: { id: 1 } };
        const res = {
            render: (view, data) => {
                assert.equal(view, 'rateProduct.ejs');
                assert.equal(data.id, 1);
                assert(data.product);
            }
        };

        await getRating(req, res);
    });

    test('showAllCommentsAndRatings should return comments and ratings for a valid product ID', async () => {
        const req = { params: { id: 1 } };
        const res = {
            render: (view, data) => {
                assert.equal(view, 'productPageInfo.ejs');
                assert(Array.isArray(data.comments));
                assert(data.comments.length > 0);
            }
        };
        await showAllCommentsAndRatings(req, res);
    });

    test('getAllCommentsAndRatings should return comments and ratings for a valid product ID', async () => {
        const id = 1; // Assume this is a valid product ID
        const result = await getAllCommentsAndRatings(id);

        assert(result.length > 0, 'No comments or ratings were found.');

        // Check that all results have the correct properties
        result.forEach((item) => {
            assert(item.commentid, 'Product ID is undefined.');
            assert(item.rating, 'Rating is undefined.');
            assert(item.timedate, 'TimeDate is undefined.');
        });
    });

    test('addCommentAndRating should add a comment and rating to the database', async () => {
        const id = 1; // Product ID
        const commentText = 'This is a test review';
        const rating = 4;

        await addCommentAndRating(id, commentText, rating);

        // Fetch the specific comment
        const commentResult = await sql`SELECT commenttext FROM comments WHERE id = ${id} AND commenttext = ${commentText} LIMIT 1`;
        assert(commentResult.length > 0, 'No comment found with the given ID and text');
        assert.equal(commentResult[0].commenttext, commentText, 'Comment text does not match');

        // Fetch the specific rating
        const ratingResult = await sql`SELECT * FROM ratings WHERE id = ${id} LIMIT 1`;
        assert(ratingResult.length > 0, 'No rating found for the given ID');
        assert.equal(ratingResult[0].rating, rating, 'Rating does not match');
    });
    
    after(() => sql.close());

});

suite('Error Handling Tests', () => {
    test('getRating should return an error if the id is invalid and can not render page with product details', async () => {
        const req = { params: { id: 99999 } };
        const res = {
            status: (code) => {
                assert.equal(code, 404);
                return res;
            },
            send: (error) => {
                assert.equal(error, 'Product not found');
            }
        };

        await getRating(req, res);
    });

    test('createReview should return an error if the product ID is invalid', async () => {
        const req = {
            params: { id: null },
            body: { reviewText: 'This is a test review', rating: 4 }
        };
        const res = {
            status: (code) => {
                assert.equal(code, 500);
                return res;
            },
            send: (error) => {
                assert.equal(error, 'Server error');
            }
        };

        await createReview(req, res);
    });

    test('addCommentAndRating should return an error if the id is invalid', async () => {
        const id = 99999; // Assume this is an invalid product ID
        const commentText = 'This is a test review';
        const rating = 4;

        const result = await addCommentAndRating(id, commentText, rating);
        assert.equal(result, 'PostgresError: insert or update on table "comments" violates foreign key constraint "fk_product"');
    });

    test('addCommentAndRating should return an error if the rating is invalid', async () => {
        const id = 1; 
        const commentText = 'This is a test review';
        const rating = 6;

        const result = await addCommentAndRating(id, commentText, rating);
        assert.equal(result, 'PostgresError: new row for relation "ratings" violates check constraint "ratings_rating_check"');
    });

    test('addCommentAndRating should return an error if the commentText is invalid', async () => {
        const id = 1; 
        const commentText = null;
        const rating = 5;

        const result = await addCommentAndRating(id, commentText, rating);
        assert.equal(result, 'PostgresError: null value in column "commenttext" of relation "comments" violates not-null constraint');
    });

    test('showAllCommentsAndRatings should return an error if the product ID is invalid', async () => {
        const req = { params: { id: 99999 } }; 
        const res = {
            status: (code) => {
                assert.equal(code, 500);
                return res;
            },
            send: (error) => {
                assert.equal(error, 'Server Error');
            },
            render: (view, data) => {
                assert.equal(view, 'productPageInfo.ejs');
                assert.equal(data.comments.length, 0, 'Expected no comments or ratings');
            }
        };
        await showAllCommentsAndRatings(req, res);
        
    });

    test('getAllCommentsAndRatings should return an error if the product ID is invalid', async () => {
        const id = 99999; // Assume this is an invalid product ID
        const result = await getAllCommentsAndRatings(id);

        assert.equal(result, 'No comments or ratings found.');
    });


    after(() => sql.close());

});
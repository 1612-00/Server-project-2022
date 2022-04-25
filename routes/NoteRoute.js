const router = require('express').Router();
const verifyToken = require('../middleware/VerifyToken');
const Note = require('../model/Note');

// @route POST api/Note
// @desc Add a Note
// @access Private
router.post('/', verifyToken, async (req, res) => {
    const { content, color, date } = req.body;

    if (!content || !color || !date) {
        return res
            .status(400)
            .json({ success: false, message: 'Note missing property' });
    }

    try {
        const newNote = new Note({
            content,
            color,
            date,
            userId: req.userId,
        });
        await newNote.save();
        return res.status(200).json({
            success: true,
            message: 'Add Note successfully',
            note: newNote,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route GET api/Note
// @desc Get all Note
// @access Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId });
        return res.status(200).json({ success: true, notes });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route GET api/Note
// @desc Get a Note
// @access Private
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const note = await Note.findById({
            _id: req.params.id,
            userId: req.userId,
        });
        return res.status(200).json({ success: true, note });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route PUT api/Note
// @desc Update Note
// @access Private
router.put('/:id', verifyToken, async (req, res) => {
    const { content, color, date, userId } = req.body;

    if (!content || !color || !date || !userId) {
        return res
            .status(400)
            .json({ success: false, message: 'Note missing property' });
    }

    try {
        let updatedNote = {
            content,
            color,
            date,
            userId,
        };

        // {new: true} to return updated Note
        updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            updatedNote,
            { new: true }
        );

        if (!updatedNote) {
            return res.status(401).json({
                success: false,
                message: 'Note not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Updated successfully',
            note: updatedNote,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

// @route DELETE api/Note
// @desc Delete Note
// @access Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleteNote = await Note.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId,
        });

        if (!deleteNote) {
            return res.status(401).json({
                success: false,
                message: 'Note not found',
            });
        }
        return res
            .status(200)
            .json({ success: true, message: 'Delete Note successfully' });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;

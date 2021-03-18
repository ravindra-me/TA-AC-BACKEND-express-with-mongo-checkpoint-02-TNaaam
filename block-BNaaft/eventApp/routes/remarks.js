var express = require('express');
var router = express.Router();
var Remarks = require('../models/Remark');
var Events = require('../models/Events');

router.get('/:id/commentdelete' ,(req, res, next)=>{
    console.log('delte')
    Remarks.findByIdAndDelete(req.params.id , (err, content)=>{
        if(err) return next(err);
        Events.findByIdAndUpdate(content.eventId , {$pull : {remarks: content._id}}, (err ,updateEvent)=> {
            if(err) return next(err)
            console.log(updateEvent)
            res.redirect('/events/' + content.eventId)
        })
    })
})


router.get('/:id/commentlike' , (req, res, next)=>{
    Remarks.findByIdAndUpdate(req.params.id , {$inc : {likes : 1}} , {new: true},(err , updatelikes)=> {
        if(err) return next(err)
        console.log(updatelikes)
        Events.findByIdAndUpdate(updatelikes.eventId , {new:true},(err, content)=>{
            if(err) return next(err)
            console.log(content)
            res.redirect('/events/' + updatelikes.eventId);
        })
    })
})


router.get('/:id/commentedit', (req, res, next)=> {
    Remarks.findById(req.params.id , (err , content)=> {
        if(err) return next(err);
        res.render('editComment' , {data:content});
    })
})

router.post('/:id/commentedit' , (req, res, next)=> {
    Remarks.findByIdAndUpdate(req.params.id , req.body , {new:true} , (err, content)=> {
        if(err) return next(err);
        Events.findByIdAndUpdate(content.eventId , {new:true} , (err , updateContent)=> {
            if(err) return next(err)
            res.redirect('/events/' + content.eventId);
        })
    })
})

module.exports = router;
const express = require('express');
const router = express.Router();
const Post = require('../tables/post');
const User = require('../tables/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const adminLayout = "../views/layouts/admin";
const jwtSecret = process.env.JWT_SECRET;

//get login admin
router.get('/admin', async (req, res) => {
    try {
      const locals = {
        title: "Admin",
      }
  
      res.render('admin/adminLogin', { locals, layout: adminLayout });
    } catch (error) {
      console.log(error);
    }
  });



//post login admin
router.post('/admin', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne( { username } );
  
      if(!user) {
        return res.redirect('/admin?msg=errorLogin');
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if(!isPasswordCorrect) {
        return res.redirect('/admin?msg=errorLogin');
      }
  
      const token = jwt.sign({ userId: user._id}, jwtSecret );
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/adminPanel?msg=loggedIn');
  
    } catch (error) {
      console.log(error);
    }
  });


  const authMiddleware = (req, res, next ) => {
    const token = req.cookies.token;
  
    if(!token) {
      return res.status(401).json( { message: 'Brak autoryzacji'} );
    }
  
    try {
      const decoded = jwt.verify(token, jwtSecret);
      req.userId = decoded.userId;
      next();
    } catch(error) {
      res.status(401).json( { message: 'Brak autoryzacji'} );
    }
  }

//logout
  router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/?msg=loggedOut');
  });

//get admin panel
router.get('/adminPanel',authMiddleware, async (req, res) => {
    try {
        const locals = {
          title: 'Admin Panel'
        }
    
        const data = await Post.find();
        res.render('admin/adminPanel', {
          locals,
          data,
          layout: adminLayout
        });
    
      } catch (error) {
        console.log(error);
      }
  });


//post register
  router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const bcryptPassword = await bcrypt.hash(password, 10);
  
      try {
        const user = await User.create({ username, password:bcryptPassword });
        res.status(201).json({ message: 'Utworzono użytkownika.', user });
      } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({ message: 'Nazwa uzytkownika istnieje.'});
        }
        res.status(500).json({ message: 'Błąd serwera.'})
      }
  
    } catch (error) {
      console.log(error);
    }
  });

//create new post GET

router.get('/createPost', authMiddleware, async (req, res) => {
    try {
      const locals = {
        title: 'Create Post',
      }
  
      const data = await Post.find();
      res.render('admin/createPost', {
        locals,
        layout: adminLayout
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });
// create new post POST
  router.post('/createPost', authMiddleware, async (req, res) => {
    try {
        const createdPost = new Post({
            title: req.body.title,
            body: req.body.body,
            cathegory: req.body.cathegory
        })
        await Post.create(createdPost);
      res.redirect('adminPanel');
      const data = await Post.find();
  
    } catch (error) {
      console.log(error);
    }
  
  });
//delete post
  router.delete('/deletePost/:id', authMiddleware, async (req, res) => {

    try {
      await Post.deleteOne( { _id: req.params.id } );
      res.redirect('/adminPanel');
    } catch (error) {
      console.log(error);
    }
  
  });


  //edit post
  router.get('/editPost/:id', authMiddleware, async (req, res) => {
    try {
  
      const locals = {
        title: "Edytuj post",
        description: "Edycja posta",
      };
  
      const data = await Post.findOne({ _id: req.params.id });
  
      res.render('admin/editPost', {
        locals,
        data,
        layout: adminLayout
      })
  
    } catch (error) {
      console.log(error);
    }
  
  });

  router.put('/editPost/:id', authMiddleware, async (req, res) => {
    try {
  
      await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body,
        cathegory: req.body.cathegory,
        updatedAt: Date.now()
      });
  
      //req.flash('success', 'Pomyślnie zaaktualizowano post.');
      res.redirect('/adminPanel');
    } catch (error) {
      console.log(error);
    }
  
  });

module.exports = router;



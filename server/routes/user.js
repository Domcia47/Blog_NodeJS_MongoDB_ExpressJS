const express = require('express');
const router = express.Router();
const Post = require('../tables/post');
//Routes

//get home pageNum
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "PlanticaBlog",
            description: "Blog poświęcony roślinom"
        }
  
      let numPostsPage = 5;

      let pageNum = req.query.page || 1;
  
      const data = await Post.aggregate([ { $sort: { createdDate: -1 } } ])
      .skip(numPostsPage * pageNum - numPostsPage)
      .limit(numPostsPage)
      .exec();
  
      const count = await Post.countDocuments({});
      const nextPage = parseInt(pageNum) + 1;
      const hasNext = nextPage <= Math.ceil(count / numPostsPage);
  
      res.render('index', { 
        locals,
        data,
        current: pageNum,
        nextPage: hasNext ? nextPage : null,
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

//get post
router.get('/post/:id', async (req, res) => {
    try {
      let slug = req.params.id;
  
      const data = await Post.findById({ _id: slug });
  
      const locals = {
        title: data.title,
        description: "Treść posta",
      }
  
      res.render('post', { 
        locals,
        data,
        currentRoute: `/post/${slug}`
      });
    } catch (error) {
      console.log(error);
    }
  
  });

//post searchTerm

router.post('/search', async (req, res) => {
  
  try {
    const locals = {
      title: "Search"
    }
    let searchTerm = req.body.q;
    
    const searchTermClean = searchTerm.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]/g, "");


    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchTermClean, 'i') }},
        { body: { $regex: new RegExp(searchTermClean, 'i') }}
      ]
    });

    res.render("searchResults", {
      data,
      locals,
    });

    res.send(searchTerm);
  } catch (error) {
    console.log(error);
  }

});

//about
router.get('/about', (req, res) => { 
    res.render('about');
});

//contact
router.get('/contact', (req, res) => { 
  res.render('contact');
});

module.exports = router;

// categories

router.get('/cathegory/:cathegory', async (req, res) => {
  try {
      const locals = {
          title: `Kategoria: ${req.params.cathegory}`,
          description: "Przeglądaj posty według kategorii"
      };

      let numPostsPage = 5;
      let pageNum = req.query.pageNum || 1;

      const data = await Post.find({ cathegory: req.params.cathegory })  
          .sort({ createdDate: -1 })
          .skip(numPostsPage * (pageNum - 1))
          .limit(numPostsPage);

      const count = await Post.countDocuments({ cathegory: req.params.cathegory });
      const nextPage = parseInt(pageNum) + 1;
      const hasNext = nextPage <= Math.ceil(count / numPostsPage);

      res.render('indexCat', {
          locals,
          data,
          current: pageNum,
          nextPage: hasNext ? nextPage : null,
          currentRoute: `/cathegory/${req.params.cathegory}`
      });

  } catch (error) {
      console.log(error);
      res.status(500).send("Błąd serwera");
  }
});



/* function insertPost() {
    Post.insertMany([
        {
            title: "Jak dbać o monsterę?",
            body: "Monstera uwielbia jasne, rozproszone światło i umiarkowane podlewanie. Zbyt częste podlewanie może prowadzić do gnicia korzeni.",
            cathegory: "pielęgnacja"
        },
        {
            title: "Najlepsze rośliny do sypialni",
            body: "Sansewieria i skrzydłokwiat poprawiają jakość powietrza. Są łatwe w pielęgnacji i dobrze znoszą półcień.",
            cathegory: "poradnik"
        },
        {
            title: "Rośliny doniczkowe dla początkujących",
            body: "Zamiokulkas i kaktusy to idealny wybór dla osób bez doświadczenia. Wymagają minimalnej opieki i są bardzo odporne.",
            cathegory: "poradnik"
        },
        {
            title: "Dlaczego liście roślin żółkną?",
            body: "Żółknięcie liści może być spowodowane nadmiernym podlewaniem lub niedoborem składników odżywczych. Warto sprawdzić wilgotność podłoża przed kolejnym podlaniem.",
            cathegory: "problemy"
        },
        {
            title: "Jak rozmnażać sukulenty?",
            body: "Najprostszy sposób to odcięcie liścia i pozostawienie go do wyschnięcia. Po kilku dniach można go umieścić w wilgotnym podłożu.",
            cathegory: "rozmnażanie"
        },
        {
            title: "Najpopularniejsze kwiaty balkonowe",
            body: "Pelargonie i surfinie to świetny wybór na słoneczny balkon. Kwitną obficie przez całe lato i nie wymagają skomplikowanej pielęgnacji.",
            cathegory: "inspiracje"
        }
    ]);
}

insertPost(); */
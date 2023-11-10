const PORT = 7000

const express = require('express');
const ejs = require('ejs');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { body, checkSchema, validationResult, matchedData } = require("express-validator");
const mongodbSession = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const User = require('./Models/users');



const mongodbURL = 'mongodb+srv://perfectpearl2030:authentication@authentication.ji5ohzv.mongodb.net/'

mongoose.connect(mongodbURL, {})
    .then(() => {
        console.log('Database Is up and connected successfully')
    }).catch(() => {
        console.log('connection fail')
    });

// const Store = new mongodbSession({
//     uri: mongodbURL,
//     collection: 'allSessions'
// })


const app = express();

app.use('/static', express.static('Asset'));
app.use("/pictures",express.static("uploads"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser("cookieParserSecrets"))
app.use(session({
    secret: 'authentication',
    saveUninitialized: false,
    resave: false,
    // store: Store
}));
app.use(flash())
app.use((req, res, next) => {
    res.locals.message = req.flash();
    next()
})
const isAuthorized = (req, res, next) => {
    if (req.session.isAuth) {
        next()
    }

    else {
        res.redirect("/login")
    }
}

// const checkUser = {
//     if
// }

const schmea = {
    name: {
        notEmpty: true,
        trim: true,
        isAlpha: {
            options: ['en-US', { ignore: [" "] }],
             errorMessage: '**Number Input Not Needed**'
        },
        isInt:{
            errorMessage:'**Only Alphabets Allowed**'
         }
         
    },
    email: {
        trim: true,
        isEmail: true,
        errorMessage: '**Enter A Valid Email**'
    },
    phone: {
        isMobilePhone: {
            options: ['any', { strictMode: true }],
        },
    },
    password: {
        notEmpty: true,
        isLength: {
            options: [{ min: 8, max: 17 }],
            errorMessage: '** Password should be between 8 and 17 characters **'
        },
       
        matches: {
          options: /^(09|\+639)\d{9}$/,
          errorMessage: '** must contain a number and special characters**'
        }
    },
cpassword: {
    custom:(value)=>{
        if(!value){
                 return Promise.reject('Passwords Do not Match')
        }
        const hash =bcrypt.hashSync(value);
        return value===hash;
    }
 
    }    
}       
   
        // isIdentical

      



app.set('view engine', 'ejs');
app.set('views', 'Templates')

// app.get('/', (req, res) => {
//     // req.session.isAuth = true
//     // console.log(req.session)
//     // console.log(req.session.id)

//     res.render('index', { title: 'Home' })

// });

//register

app.get('/register', (req, res) => {
   let err = ""
    const data = ''
    res.render('register', { title: 'Registration', err , data });  //passing title to the template as a variable
});


app.post("/register", async (req, res) => {
    const { email } = req.body
    console.log(req.body)
    let user = await User.findOne({ email });

    if (user) {
        req.flash('error', 'E-mail already in use')
        return res.redirect('/register');

    }
    else {
        // const result = validationResult(req);
        // const Error = result.errors;
        // console.log(Error)
        // const data = req.body;
        // const x = matchedData(req);
        // let err ={}
        // Error.forEach(item => {
        //     err[item.path] = item.msg
        // });

        // const cpasswordhash =  await bcrypt.hash(request.cpassword, 16)
        const hashedpassword = await bcrypt.hash(req.body.password, 16);
        user = new User({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phone,
            dateOfBirth: req.body.dob,
            password: hashedpassword,

        });
        await user.save()
       
            .catch(e => {
                console.log(e)
                req.flash('error', 'E-mail already in use')
        // return res.redirect('/register');
            });
        //     if (result.isEmpty()) {
        //         
              
        //    }
        //    res.render("register", { title:"Registration", err, data });
        return res.redirect('/login')
    }
})



//login

app.get('/login', (req, res) => {
    const err = ""
    res.render('login', { title: "Log In", err: err });   //passing title to the template as a variable
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body
    let user = await User.findOne({ email });
    if (!user) {
        req.flash('error', 'Invalid Email, Use a registered email or click on register to signup')
        return res.redirect('/login')

    }

    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
        req.flash('error', 'Invalid Password, Use a registered password')
        return res.redirect('/login')
    }
    else {
        req.session.isAuth = true
        req.flash('success', 'Successfully signed in')
        res.redirect("/dashboard")
    }

})


//dashborad
app.get('/dashboard', isAuthorized, (req, res) => {
    const userName = req.flash("user")
    res.render('dashboard', { title: "Dashboard", userName });
})


//logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        }

        else {
            res.redirect("/");
        }
    })

});

// app.use("", require('./BlogRoutes/routes'))
app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`)
})
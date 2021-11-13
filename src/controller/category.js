const slugify = require('slugify');
const Category = require('../models/category');


// recursive call  for Parent Category and Children Category
function createCategories(categories, parentId = null) {

    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter((cat) => cat.parentId == undefined);
        
    } else {
        category = categories.filter((cat) => cat.parentId == parentId);
    }

    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            parentId: cate.parentId,
            slug: cate.slug,
            children: createCategories(categories, cate._id)
        })
    }

    
    return categoryList;

};

// Adding Category
exports.addCategory = (req, res) => {

    // Create Category
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name),
    }

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    if (req.file) {
        categoryObj.categoryPicture = process.env.API + '/public/' + req.file.filename;
    }
    
    const cat = new Category(categoryObj);
    cat.save((error, category) => {
        if (error) return res.status(400).json({ error });
        if (category) {
            return res.status(201).json({ category })
            
        }
        
    });

}

// Listing Category
exports.getCategory = (req, res) => {
    Category.find({}).exec((error, categories) => {
        if (error) return res.status(400).json({ error });
        if (categories) {
            const categoryList = createCategories(categories)
            res.status(200).json({ categoryList });
            console.log(categoryList)
        }
    });
}
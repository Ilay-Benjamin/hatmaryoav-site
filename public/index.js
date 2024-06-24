var x = 0;
var y = 0;

function displayNextImage() {
    console.log('\n' + "." + '\n');

    console.log("BEFORE x: " + x );
    console.log("BEFORE y:" + y );

    console.log("RoundImages Number: " + (imageFiles[[1]].length));
    console.log("Rounds Number: " + (imageFiles[0].length));
    console.log("ImageFolders Number: " + (imageFiles.length));

    for (let z = 0; z < IMAGE_ELEMENT_FOLDER_NUMBER; z++) {
        console.log("imageElement: " + imageElements[z]);
        console.log("ImageFile: " +  JSON.stringify(imageFiles[z][y][x]));
        document.getElementById(imageElements[z]).src = imageFiles[z][y][x];
    }

    if (x + 1 == ROUND_IMAGE_FIELS_NUMBER) {
        if (y + 1 == ROUNDS_NUMBER) {
            y = 0;
        } else {
            y = y + 1;
        }
        x = 0;
    } else {
        x = x + 1;
    }

    console.log("AFTER x: " + x);
    console.log("AFTER y:" + y);

    console.log('\n' + "." + '\n');


}


function displayPreviousImage() {
    x = (x <= 0) ? images.length - 1 : x - 1;
    document.getElementById(element_id).src = images[x];
}

function startTimer() {
    setInterval(displayNextImage, 4000);
}




var imageFiles = [[[]]];

let path = TITLE_SWIPED_IMAGES_FOLDER_PATH;

for(let e = 0; e < IMAGE_ELEMENT_FOLDER_NUMBER; e++) {
    path = TITLE_SWIPED_IMAGES_FOLDER_PATH;
    let cElement = [[]];
    let cElementName = appendIndex(IMAGE_ELEMENT_FOLDER_NAME, e);
    for(let r = 0; r < ROUNDS_NUMBER; r++) {
        path = TITLE_SWIPED_IMAGES_FOLDER_PATH;
        let cRoundName = appendIndex(ROUND_FOLDER_NAME, r);
        let cRound = [];
        for(let f = 0; f < ROUND_IMAGE_FIELS_NUMBER; f++) {
            path = TITLE_SWIPED_IMAGES_FOLDER_PATH;
            let cFileName = appendIndex(IMAGE_FILE_NAME, f);
            let fileName = appendFormat(cFileName, "jpg");
            console.log("e:["+e+"] , r:["+r+"] , f:["+f+"]");
            cRound.push(assemble(assemble(assemble(path, cElementName), cRoundName), fileName));
            console.log("FINAL Path: " + assemble(assemble(assemble(path, cElementName), cRoundName), fileName));
        }
        cElement[r] = cRound;
    }
    imageFiles[e] = cElement;
}

console.log('\n' + "." + '\n');

console.log("imageFiles: " + JSON.stringify(imageFiles));

console.log('\n' + "." + '\n');

console.log("imageFiles[2]: " + JSON.stringify(imageFiles[2]));
console.log("imageFiles[2][0]: " + JSON.stringify(imageFiles[2][0]));
console.log("imageFiles[2][0][3]: " + JSON.stringify(imageFiles[2][0][3]));

console.log('\n' + "." + '\n');

var imageElements = [];
for(let e = 0; e < IMAGE_ELEMENT_FOLDER_NUMBER; imageElements[e] = appendIndex(IMAGE_ELEMENT_ID, e), console.log(imageElements[e]), e++);

console.log('\n' + "." + '\n');

console.log("imageElements: " + JSON.stringify(imageElements));

console.log('\n' + "." + '\n');

console.log("imageFiles[0][0][0]: " + JSON.stringify(imageFiles[0][0][0]));
console.log("imageFiles[1][0][0]: " + JSON.stringify(imageFiles[1][0][0]));
/*
var pointers = [[[[]]]];
var pointersNumber = IMAGE_ELEMENTS_NUMBER;
for(let p = 0; p < pointersNumber; pointers++) {
    for(let e = 0; e < IMAGE_ELEMENTS_NUMBER; e++){
        for(let r = 0; r < ROUNDS_NUMBER; r++){
            for(let f = 0; f < ROUND_IMAGE_FIELS_NUMBER; f++){
                pointers[p][e][r][f] = 0;
            }
        }
    }
}

*/
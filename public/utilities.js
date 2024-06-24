function assemble(dir, itemName) { return dir + "/" + itemName; }


function appendFormat(fileName, fileFormat) { return fileName + "." + fileFormat; }


function appendIndex(itemName, offset) {
    return itemName + (itemName == IMAGE_ELEMENT_FOLDER_NAME ?
      IMAGE_FOLDER_INDEXES : OTHER_INDEXES)[offset]; 
}



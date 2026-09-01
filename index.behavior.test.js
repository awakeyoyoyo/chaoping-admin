const assert = require("assert");
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

function testBannerTabExists() {
  assert(html.includes('data-tab="banners"'), "banner tab should be present");
  assert(html.includes('id="bannerSidebar"'), "banner sidebar should be present");
}

function testBannerUploadAndDeleteHandlersExist() {
  assert(html.includes('id="bannerImageInput"'), "banner upload input should be rendered");
  assert(html.includes("function onBannerImageChange"), "banner upload handler should exist");
  assert(html.includes("function deleteBanner"), "banner delete handler should exist");
}

function testAdminScriptSyntax() {
  const match = html.match(/<script>([\s\S]*)<\/script>/);
  assert(match, "admin script should exist");
  new Function(match[1]);
}

function testProductFormDoesNotUseRegistrationNumber() {
  assert(!html.includes("pf_reg"), "product form should not include registration number input");
  assert(!html.includes("registration_number"), "admin page should not read or save registration_number");
  assert(!html.includes("登记号"), "admin page should not display registration number");
}

function testProductThumbnailUsesWhiteCanvasBackground() {
  const drawIndex = html.indexOf("ctx.drawImage(image, 0, 0, canvas.width, canvas.height)");
  const fillIndex = html.indexOf("ctx.fillStyle = '#ffffff'");
  assert(fillIndex >= 0, "thumbnail canvas should set white fill style");
  assert(
    fillIndex >= 0 && fillIndex < drawIndex,
    "thumbnail canvas should fill white before drawing PNG image"
  );
}

function testProductFormSupportsMultipleImages() {
  assert(html.includes('id="pf_images"'), "product form should use multi-image input");
  assert(html.includes("multiple"), "product image input should allow multiple files");
  assert(html.includes("function onProductImagesChange"), "multi-image change handler should exist");
  assert(html.includes("function removeProductImageItem"), "image removal handler should exist");
  assert(html.includes("function moveProductImageItem"), "image reorder handler should exist");
  assert(html.includes("function setProductImageAsMain"), "set main image handler should exist");
}

function testProductThumbnailUsesFirstImage() {
  assert(html.includes("const mainItem = uploadedItems[0]"), "cover thumbnail should use first image item");
  assert(
    html.includes("createProductThumbnailFile(mainItem.file)"),
    "cover thumbnail should be generated from first new image"
  );
  assert(
    html.includes("editingProductOriginalCoverThumb"),
    "unchanged first image should reuse existing thumbnail"
  );
}

function testCategoryDeleteActionExists() {
  assert(html.includes("function deleteCategory"), "category delete handler should exist");
  assert(html.includes("adminDeleteCategory"), "admin page should call delete category function");
  assert(html.includes("删除分类"), "admin page should expose category delete action");
}

function testAdminIngredientSeparatorUsesBoldDot() {
  assert(!html.includes(".join(' + ')"), "admin product card should not use plus separator");
  assert(
    html.includes("'<strong class=\"ingredient-separator\">·</strong>'"),
    "admin product card should use bold dot separator"
  );
  assert(
    html.includes(".ingredient .ingredient-separator"),
    "admin product card should style ingredient separator"
  );
}

function testProductKeyPointsSupportMultilineEditing() {
  assert(
    html.includes("<textarea") && html.includes("data-prefix=\"${prefix}\""),
    "dynamic text rows should support textarea editing"
  );
  assert(
    html.includes("collectDynamicRows") && html.includes("textarea"),
    "dynamic row collection should read textarea values"
  );
}

function testHotSolutionAdminManagementExists() {
  assert(html.includes('data-tab="solutions"'), "solution tab should be present");
  assert(html.includes('id="solutionSidebar"'), "solution sidebar should be present");
  assert(html.includes("let hotSolutions"), "admin should keep hot solution state");
  assert(html.includes("function loadHotSolutions"), "admin should load hot solutions");
  assert(html.includes("function openHotSolutionForm"), "admin should expose solution form");
  assert(html.includes("function saveHotSolution"), "admin should save hot solutions");
  assert(html.includes("function deleteHotSolution"), "admin should delete hot solutions");
  assert(html.includes("adminCreateHotSolution"), "admin should call create hot solution function");
  assert(html.includes("adminUpdateHotSolution"), "admin should call update hot solution function");
  assert(html.includes("adminDeleteHotSolution"), "admin should call delete hot solution function");
}

function testDiseaseCategoryAdminManagementExists() {
  assert(html.includes('data-tab="diseases"'), "disease category tab should be present");
  assert(html.includes('id="diseaseSidebar"'), "disease sidebar should be present");
  assert(html.includes('id="diseaseModal"'), "disease category modal should be present");
  assert(html.includes("let diseaseCategories"), "admin should keep disease category state");
  assert(html.includes("function loadDiseaseCategories"), "admin should load disease categories");
  assert(html.includes("function openDiseaseCategoryForm"), "admin should expose disease category form");
  assert(html.includes("function saveDiseaseCategory"), "admin should save disease categories");
  assert(html.includes("function deleteDiseaseCategory"), "admin should delete disease categories");
  assert(html.includes("adminCreateDiseaseCategory"), "admin should call create disease category function");
  assert(html.includes("adminUpdateDiseaseCategory"), "admin should call update disease category function");
  assert(html.includes("adminDeleteDiseaseCategory"), "admin should call delete disease category function");
  assert(html.includes('id="dcf_icon"'), "disease category form should include icon image upload input");
  assert(html.includes("function onDiseaseCategoryIconChange"), "admin should preview disease category icon uploads");
  assert(html.includes("function uploadDiseaseCategoryIconIfNeeded"), "admin should upload disease category icons");
  assert(html.includes("disease-categories/icons/"), "disease category icons should use disease icon storage path");
  assert(html.includes("icon,"), "disease category save payload should include icon fileID");
}

function testProductFormSupportsDiseaseCategories() {
  assert(html.includes('name="pf_diseaseCategories"'), "product form should render disease category checkboxes");
  assert(html.includes("function getSelectedProductDiseaseCategories"), "admin should collect selected disease categories");
  assert(html.includes("diseaseCategories: diseaseCategoriesValue"), "product save payload should include disease categories");
  assert(html.includes("病害：${escHtml(diseaseText)}"), "product cards should display disease categories");
}

function testHotSolutionAdminUploadsImagesAndProductRows() {
  assert(html.includes('id="hs_images"'), "solution form should upload solution images");
  assert(html.includes('id="hs_effectImages"'), "solution form should upload effect images");
  assert(html.includes("hot-solutions/images/"), "solution images should use solution storage path");
  assert(html.includes("hot-solutions/effects/"), "effect images should use effect storage path");
  assert(html.includes("方案名称"), "solution form should include name");
  assert(html.includes("产品名称") && html.includes("含量") && html.includes("厂家"), "solution form should include product rows");
  assert(html.includes("方案特点"), "solution form should include features");
}

/**
 * 验证热销方案产品行具备拖拽排序能力。
 * @returns {void} 无返回值。
 * @example
 * testHotSolutionProductRowsSupportDragOrdering();
 */
function testHotSolutionProductRowsSupportDragOrdering() {
  assert(html.includes("function initSolutionProductRowDrag"), "solution product rows should initialize drag ordering");
  assert(html.includes("function moveSolutionProductRowByDrag"), "solution product rows should move by drag");
  assert(html.includes('class="solution-product-drag-handle"'), "solution product rows should show a drag handle");
  assert(html.includes('draggable="true"'), "solution product rows should be draggable");
  assert(html.includes("products: collectSolutionProducts()"), "saving should collect products from current row order");
}

function testProductListSupportsSearchAndInfiniteScroll() {
  assert(html.includes('class="product-search-input"'), "product search input should exist");
  assert(html.includes("function onProductSearchConfirm"), "product search confirm handler should exist");
  assert(html.includes("function onClearProductKeyword"), "product search clear handler should exist");
  assert(html.includes("function resetProductList"), "product list reset handler should exist");
  assert(html.includes("function loadMoreProducts"), "product load more handler should exist");
  assert(html.includes("function setupProductLoadObserver"), "product infinite scroll observer should exist");
  assert(html.includes("function refreshCategoryProductTotals"), "category totals refresh should exist");
  assert(html.includes('id="productLoadSentinel"'), "product load sentinel should exist");
  assert(!html.includes("pageSize: 200"), "admin should not hardcode pageSize 200");
  assert(html.includes("已显示 ${products.length} / 共 ${productTotal} 个产品"), "product count summary should exist");
}

function testFileIdToCdnUrlConvertsCloudFileId() {
  assert(html.includes("fileIdToCdnUrl"), "admin should define a fileIdToCdnUrl helper");
  assert(html.includes("tcb.qcloud.la"), "admin should convert fileIDs to the default CDN domain");
}

Promise.resolve()
  .then(testFileIdToCdnUrlConvertsCloudFileId)
  .then(testBannerTabExists)
  .then(testBannerUploadAndDeleteHandlersExist)
  .then(testAdminScriptSyntax)
  .then(testProductFormDoesNotUseRegistrationNumber)
  .then(testProductThumbnailUsesWhiteCanvasBackground)
  .then(testProductFormSupportsMultipleImages)
  .then(testProductThumbnailUsesFirstImage)
  .then(testCategoryDeleteActionExists)
  .then(testAdminIngredientSeparatorUsesBoldDot)
  .then(testProductKeyPointsSupportMultilineEditing)
  .then(testHotSolutionAdminManagementExists)
  .then(testDiseaseCategoryAdminManagementExists)
  .then(testProductFormSupportsDiseaseCategories)
  .then(testHotSolutionAdminUploadsImagesAndProductRows)
  .then(testHotSolutionProductRowsSupportDragOrdering)
  .then(testProductListSupportsSearchAndInfiniteScroll)
  .then(() => {
    console.log("admin banner behavior tests passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// src/composables/useManagementUtils.js
import { ref } from 'vue'
import axios from 'axios'
// import { fetchedData } from '../main'

export function useManagementUtils() {
  const titlevalue = ref('')
  const keyvalue = ref('')
  const keyID = ref('')
  const acKeyID = ref('')
  const newtitle = ref('')
  const modifytitle = ref('')
  const deletetitle = ref('')
  const xlsxFilename = ref('')
  const xlsxSheetname = ref('')
  const resultData = ref('')

  function setMetaByCat(cat) {
    switch (cat) {
      case 'AT':
        titlevalue.value = 'Szerző'
        keyvalue.value = 'AT_AUTHORNAME'
        keyID.value = 'AT_ID'
        acKeyID.value = 'AT_NN_ID'
        newtitle.value = 'Új szerző'
        modifytitle.value = 'Szerző módosítása'
        deletetitle.value = 'Biztos végleg törli a szerzőt?'
        xlsxFilename.value = 'authors.xlsx'
        xlsxSheetname.value = 'Szerzők'
        break
      case 'CG':
        titlevalue.value = 'Műfaj'
        keyvalue.value = 'CG_CATEGORY'
        keyID.value = 'CG_ID'
        newtitle.value = 'Új műfaj'
        modifytitle.value = 'Műfaj módosítása'
        deletetitle.value = 'Biztos végleg törli a műfajt?'
        xlsxFilename.value = 'category.xlsx'
        xlsxSheetname.value = 'Műfajok'
        break
      case 'BT':
        console.log("Kategóriák!!!")
        titlevalue.value = 'Kategória'
        keyvalue.value = 'BT_TYPENAME'
        keyID.value = 'BT_ID'
        newtitle.value = 'Új kategória'
        modifytitle.value = 'Kategória módosítása'
        deletetitle.value = "Biztos végleg törli a kategóriát?"
        xlsxFilename.value = 'booktype.xlsx'
        xlsxSheetname.value = 'Kategóriák'
        break;
      case 'OS':
        console.log("Státuszok!!!")
        titlevalue.value = 'Státusz'
        keyvalue.value = 'OS_NAME'
        keyID.value = 'OS_ID'
        newtitle.value = 'Új státusz'
        modifytitle.value = 'Státusz módosítása'
        deletetitle.value = "Biztos végleg törli a státuszt?"
        xlsxFilename.value = 'ownershipstatus.xlsx'
        xlsxSheetname.value = 'Státuszok'
        break;
      case 'PS':
        console.log("Kiadók!!!")
        titlevalue.value = 'Kiadó'
        keyvalue.value = 'PS_PUBLISHERNAME'
        keyID.value = 'PS_ID'
        newtitle.value = 'Új kiadó'
        modifytitle.value = 'Kiadó módosítása'
        deletetitle.value = "Biztos végleg törli a kiadót?"
        xlsxFilename.value = 'publisher.xlsx'
        xlsxSheetname.value = 'Kiadók'
        break;
    
      default:
        break;
    }
  }

  async function setItem({ action, myDialog, selectedItem, cat, fetchData, snackbarState }) {
    const txt = ref('')
    const actiontxt = action === 'add' ? 'felvitele' : action === 'upd' ? 'módosítása' : 'törlése'
    snackbarState.color.value = 'red'

    try {
      const res = await axios.post(`/${action}/${cat}`, {
        name: myDialog.fieldTextValue,
        id: action === 'add' ? -1 : selectedItem?.value?.[keyID.value],
        nationalityid: cat === 'AT' && myDialog.autocompleteValue
          ? myDialog.autocompleteValue.NN_ID
          : null
      })

      console.log('myDialog res: ', res)
      if (res?.status == 200) {
        txt.value = `A ${titlevalue.value.toLowerCase()} ${actiontxt} sikeresen megtörtént!`
        snackbarState.color.value = 'green'
        resultData.value = await fetchData(cat)
        console.log('resultData setitem: ', resultData)
      }
    } catch (error) {
      console.error('Hiba:', error)
      if (error?.response?.status === 409) {
          txt.value = `Ez a ${titlevalue.value.toLowerCase()} már létezik!`
      } else {
        txt.value = error?.response?.status === 400
          ? 'Nem törölhető, mert van hozzárendelve könyv!'
          : `Hiba történt a ${titlevalue.value.toLowerCase()} ${actiontxt} közben!`
      }
    }

    snackbarState.message.value = txt.value
    snackbarState.active.value = true
    setTimeout(() => {
      snackbarState.active.value = false
    }, 5000)
  }

  return {
    titlevalue, keyvalue, keyID, acKeyID, newtitle, modifytitle, deletetitle, xlsxFilename, xlsxSheetname, resultData,
    setMetaByCat, setItem
  }
}

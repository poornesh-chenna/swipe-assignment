import { useSelector } from 'react-redux'
import { selectInvoiceList } from './invoicesSlice'

export const useInvoiceListData = () => {
  const invoiceList = useSelector(selectInvoiceList)

  const getOneInvoice = (receivedId) => {
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null
    )
  }

  const getInvoiceFromId = async (receivedId) => {
    return (
      invoiceList.find(
        (invoice) => invoice.id.toString() === receivedId.toString()
      ) || null
    )
  }

  const getSelectedInvoices = async (receivedIds) => {
    const selectedInvoices = []

    for (const id of receivedIds) {
      const singleInvoice = await getInvoiceFromId(id)
      selectedInvoices.push(singleInvoice)
    }

    return selectedInvoices
  }

  const listSize = invoiceList.length

  return {
    invoiceList,
    getOneInvoice,
    listSize,
    getSelectedInvoices,
  }
}

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useInvoiceListData } from '../redux/hooks'
import { nanoid } from '@reduxjs/toolkit'
import { Button, Table, Form, Container } from 'react-bootstrap'
import { BiTrash } from 'react-icons/bi'
import { MdOutlinePlaylistAdd } from 'react-icons/md'
import EditableField from '../components/EditableField'
import { useDispatch } from 'react-redux'
import { updateMultipleInvoice } from '../redux/invoicesSlice'
import styles from '../styles/InvoiceBulkEdit.module.css'

const InvoiceBulkEdit = () => {
  const location = useLocation()
  const navigate = useNavigate()
  let selectedInvoices
  if (location.state !== null) {
    selectedInvoices = location.state.selectedInvoices
  }
  const { getSelectedInvoices } = useInvoiceListData()
  const [invoices, setinvoices] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedInvoices) {
      getSelectedInvoices(selectedInvoices).then((data) => {
        setinvoices(data)
      })
    } else {
      alert('No invoices selected')
      navigate('/')
    }
  }, [])

  const handleUpdate = () => {
    dispatch(updateMultipleInvoice(invoices))
    alert('Updated successfully 🥳')
    navigate('/')
  }

  return (
    <Container fluid className="p-3">
      <Table striped hover responsive size="lg" style={{ width: '130rem' }}>
        <thead>
          <tr>
            <th className={styles.thdata} rowSpan={2}>
              Invoice NO
            </th>
            <th className={styles.thdata} rowSpan={2}>
              Date Of Issue
            </th>
            <th className={styles.thdata} colSpan={3}>
              Bill To
            </th>
            <th className={styles.thdata} colSpan={3}>
              Bill From
            </th>
            <th className={styles.thdata} colSpan={6}>
              Items
            </th>
            <th className={styles.thdata} rowSpan={2}>
              Tax %
            </th>
            <th className={styles.thdata} rowSpan={2}>
              Discount %
            </th>
            <th className={styles.thdata} rowSpan={2}>
              Total
            </th>
          </tr>
          <tr>
            <th className={styles.thdata}>Name</th>
            <th className={styles.thdata}>Email</th>
            <th className={styles.thdata}>Address</th>
            <th className={styles.thdata}>Name</th>
            <th className={styles.thdata}>Email</th>
            <th className={styles.thdata}>Address</th>
            <th className={styles.thdata}>Item NO</th>
            <th className={styles.thdata}>Name</th>
            <th className={styles.thdata}>Description</th>
            <th className={styles.thdata}>Quantity</th>
            <th className={styles.thdata}>Price</th>
            <th className={styles.thdata}>Remove</th>
          </tr>
        </thead>
        <tbody>
          {invoices &&
            invoices.map((invoice, idx) => (
              <TableRow
                invoice={invoice}
                setinvoices={setinvoices}
                invoices={invoices}
                key={idx}
              />
            ))}
        </tbody>
      </Table>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '25px' }}
      >
        <Button style={{ width: '60%' }} onClick={handleUpdate}>
          Update
        </Button>
      </div>
    </Container>
  )
}

const TableRow = ({ invoice, setinvoices, invoices }) => {
  const [calculateTotal, setcalculateTotal] = useState(false)

  useEffect(() => {
    handleCalculateTotal()
  }, [calculateTotal])

  const handleChange = (name, value) => {
    const updatedInvoices = invoices.map((obj) =>
      obj.id === invoice.id ? { ...obj, [name]: value } : obj
    )
    setinvoices(updatedInvoices)
    setcalculateTotal(!calculateTotal)
  }

  const onItemizedItemEdit = (evt, id) => {
    const updatedItems = invoice.items.map((oldItem) => {
      if (oldItem.itemId === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value }
      }
      return oldItem
    })
    const updatedInvoices = invoices.map((obj) =>
      obj.id === invoice.id ? { ...obj, items: updatedItems } : obj
    )
    setinvoices(updatedInvoices)
    setcalculateTotal(!calculateTotal)
  }

  const addItem = (e) => {
    e.preventDefault()
    const newItem = {
      itemId: nanoid(),
      itemName: '',
      itemDescription: '',
      itemQuantity: 1,
      itemPrice: '1.00',
    }
    const updatedItems = invoice.items.map((item) => item)
    updatedItems.push(newItem)
    const updatedInvoices = invoices.map((obj) =>
      obj.id === invoice.id ? { ...obj, items: updatedItems } : obj
    )
    setinvoices(updatedInvoices)
    setcalculateTotal(!calculateTotal)
  }

  const handleRowDel = (id) => {
    const updatedItems = invoice.items.filter((item) => item.itemId !== id)
    const updatedInvoices = invoices.map((obj) =>
      obj.id === invoice.id ? { ...obj, items: updatedItems } : obj
    )
    setinvoices(updatedInvoices)
    setcalculateTotal(!calculateTotal)
  }

  const handleCalculateTotal = () => {
    const updatedInvoices = invoices.map((obj) => {
      if (obj.id === invoice.id) {
        let subTotal = 0

        obj.items.forEach((item) => {
          subTotal +=
            parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity)
        })

        const taxAmount = parseFloat(subTotal * (obj.taxRate / 100)).toFixed(2)
        const discountAmount = parseFloat(
          subTotal * (obj.discountRate / 100)
        ).toFixed(2)
        const total = (
          subTotal -
          parseFloat(discountAmount) +
          parseFloat(taxAmount)
        ).toFixed(2)

        return {
          ...obj,
          subTotal: parseFloat(subTotal).toFixed(2),
          taxAmount,
          discountAmount,
          total,
        }
      } else {
        return obj
      }
    })
    setinvoices(updatedInvoices)
  }

  return (
    <>
      <tr>
        <td
          style={{ textAlign: 'center' }}
          className={styles.tdata}
          rowSpan={invoice.items.length + 1}
        >
          {invoice.invoiceNumber}
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            type="date"
            value={invoice.dateOfIssue}
            name="dateOfIssue"
            className="my-2"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            required
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            placeholder="Who is this invoice to?"
            rows={3}
            value={invoice.billTo}
            type="text"
            name="billTo"
            className="my-2"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            autoComplete="name"
            required
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            placeholder="Email address"
            value={invoice.billToEmail}
            type="email"
            name="billToEmail"
            className="my-2"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            autoComplete="email"
            required
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            placeholder="Billing address"
            value={invoice.billToAddress}
            type="text"
            name="billToAddress"
            className="my-2"
            autoComplete="address"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            required
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            placeholder="Who is this invoice from?"
            rows={3}
            value={invoice.billFrom}
            type="text"
            name="billFrom"
            className="my-2"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            autoComplete="name"
            required
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            placeholder="Email address"
            value={invoice.billFromEmail}
            type="email"
            name="billFromEmail"
            className="my-2"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            autoComplete="email"
            required
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            placeholder="Billing address"
            value={invoice.billFromAddress}
            type="text"
            name="billFromAddress"
            className="my-2"
            autoComplete="address"
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            required
          />
        </td>
        <th className={styles.thdata}>{1}</th>
        <td className={styles.tdata}>
          <EditableField
            onItemizedItemEdit={(evt) => {
              evt.preventDefault()
              onItemizedItemEdit(evt, invoice.items[0].itemId)
            }}
            cellData={{
              type: 'text',
              name: 'itemName',
              placeholder: 'Item name',
              value: invoice.items[0].itemName,
              id: invoice.items[0].itemId,
            }}
          />
        </td>
        <td className={styles.tdata}>
          <EditableField
            onItemizedItemEdit={(evt) => {
              evt.preventDefault()
              onItemizedItemEdit(evt, invoice.items[0].itemId)
            }}
            cellData={{
              type: 'text',
              name: 'itemDescription',
              placeholder: 'Item description',
              value: invoice.items[0].itemDescription,
              id: invoice.items[0].itemId,
            }}
          />
        </td>
        <td className={styles.tdata}>
          <EditableField
            onItemizedItemEdit={(evt) => {
              evt.preventDefault()
              onItemizedItemEdit(evt, invoice.items[0].itemId)
            }}
            cellData={{
              type: 'number',
              name: 'itemQuantity',
              min: 1,
              step: '1',
              value: invoice.items[0].itemQuantity,
              id: invoice.items[0].itemId,
            }}
          />
        </td>
        <td className={styles.tdata}>
          <EditableField
            onItemizedItemEdit={(evt) => {
              evt.preventDefault()
              onItemizedItemEdit(evt, invoice.items[0].itemId)
            }}
            cellData={{
              leading: invoice.currency,
              type: 'number',
              name: 'itemPrice',
              min: 1,
              step: '0.01',
              presicion: 2,
              textAlign: 'text-end',
              value: invoice.items[0].itemPrice,
              id: invoice.items[0].itemId,
            }}
          />
        </td>
        <td className={styles.tdata}>
          <BiTrash
            onClick={(e) => {
              e.preventDefault()
              if (invoice.items.length <= 1) {
                alert('There has to be at least one item')
                return
              }
              handleRowDel(invoice.items[0].itemId)
            }}
            style={{ height: '33px', width: '33px', padding: '7.5px' }}
            className="text-white mt-1 btn btn-danger"
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            name="taxRate"
            type="number"
            value={invoice.taxRate}
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            className="bg-white border"
            placeholder="0.0"
            min="0.00"
            step="0.01"
            max="100.00"
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          <Form.Control
            name="discountRate"
            type="number"
            value={invoice.discountRate}
            onChange={(e) => {
              e.preventDefault()
              handleChange(e.target.name, e.target.value)
            }}
            className="bg-white border"
            placeholder="0.0"
            min="0.00"
            step="0.01"
            max="100.00"
          />
        </td>
        <td className={styles.tdata} rowSpan={invoice.items.length + 1}>
          {invoice.currency}
          {invoice.total || 0}
        </td>
      </tr>
      {invoice.items.map((item, idx) => (
        <>
          {idx > 0 ? (
            <tr key={idx}>
              <th className={styles.thdata}>{idx + 1}</th>
              <td className={styles.tdata}>
                <EditableField
                  onItemizedItemEdit={(evt) => {
                    evt.preventDefault()
                    onItemizedItemEdit(evt, item.itemId)
                  }}
                  cellData={{
                    type: 'text',
                    name: 'itemName',
                    placeholder: 'Item name',
                    value: item.itemName,
                    id: item.itemId,
                  }}
                />
              </td>
              <td className={styles.tdata}>
                <EditableField
                  onItemizedItemEdit={(evt) => {
                    evt.preventDefault()
                    onItemizedItemEdit(evt, item.itemId)
                  }}
                  cellData={{
                    type: 'text',
                    name: 'itemDescription',
                    placeholder: 'Item description',
                    value: item.itemDescription,
                    id: item.itemId,
                  }}
                />
              </td>
              <td className={styles.tdata}>
                <EditableField
                  onItemizedItemEdit={(evt) => {
                    evt.preventDefault()
                    onItemizedItemEdit(evt, item.itemId)
                  }}
                  cellData={{
                    type: 'number',
                    name: 'itemQuantity',
                    min: 1,
                    step: '1',
                    value: item.itemQuantity,
                    id: item.itemId,
                  }}
                />
              </td>
              <td className={styles.tdata}>
                <EditableField
                  onItemizedItemEdit={(evt) => {
                    evt.preventDefault()
                    onItemizedItemEdit(evt, item.itemId)
                  }}
                  cellData={{
                    leading: invoice.currency,
                    type: 'number',
                    name: 'itemPrice',
                    min: 1,
                    step: '0.01',
                    presicion: 2,
                    textAlign: 'text-end',
                    value: item.itemPrice,
                    id: item.itemId,
                  }}
                />
              </td>
              <td className={styles.tdata}>
                <BiTrash
                  onClick={(e) => {
                    e.preventDefault()
                    handleRowDel(item.itemId)
                  }}
                  style={{ height: '33px', width: '33px', padding: '7.5px' }}
                  className="text-white mt-1 btn btn-danger"
                />
              </td>
            </tr>
          ) : (
            ''
          )}
        </>
      ))}
      <tr>
        <td className={styles.tdata} colSpan={6}>
          <Button
            variant="secondary"
            style={{ width: '100%' }}
            onClick={addItem}
          >
            <MdOutlinePlaylistAdd style={{ fontSize: '20px' }} /> Add New Item
          </Button>
        </td>
      </tr>
    </>
  )
}

export default InvoiceBulkEdit

import React, { useContext, useEffect, useState, useRef } from "react";

import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormCheck
} from '@coreui/react'
import { } from "../../../api/accounts/Account_Api";
import AvatarUpload from "../../component_items/ImageUploader/AvatarUpload";
import { useDispatch } from "react-redux";
import { setToast } from "../../../redux/notification/toastSlice";
import { Staff_Page_Context } from "../Staff_Page";
import { FaUserCheck } from "react-icons/fa";
import DateTimePicker from "../../component_items/DatePicker/DateTimePicker";


const CustomForm = ({account, handleTableChange, onClose}) => {
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false)
  const [disabled, setDisabled] = useState(false);
  // const [imageFile, setImageFile] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);


  const roles = (
    [
      {
        id: 1,
        name: 'Saler',
      },
      {
        id: 2,
        name: 'Designer',
      },
      {
        id: 3,
        name: 'Productioner',
      }

    ]);
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  const fullname = useRef();
  const dob = useRef();
  const email = useRef();
  const phone = useRef();
  const address = useRef();
  const username = useRef();
  const password = useRef();


  const empty_input = () => {
    add_name.current.value = "";
    add_price.current.value = "";
    add_quantity.current.value = "";
    setImageBase64(null);
    setImageFile(null)

  }
  const handleSingleFileBase64 = (base64) => {
    setImageBase64(base64)
    console.log(base64)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);
    setDisabled(true);
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else if (form.checkValidity() === true) {

      const new_account = {
        username: username.current.value,
        password: password.current.value,
        image : imageBase64,
        dob: dob.current.value,
        email: email.current.value,
        fullname: fullname.current.value,
        role_id: selectedRole.id,
        phone: phone.current.value,
        address: address.current.value
      }

      console.log("add account", new_account)

      const formData = new FormData();
      formData.append('new_account', JSON.stringify(new_account));
      let response = await register(formData);
      let mess = '';
      let mess_color = '';

      if (response.success) {
        mess = response.success
        handleTableChange();
        onClose();
        setValidated(false)
        mess_color = 'success'
      } else if (response.error) {
        mess = response.error;
        mess_color = 'danger'
      }
      let product = {
        id: response.new_product_id,
      }

      dispatch(setToast({ color: mess_color, title: 'Product id ' + product.id, mess: mess }))

    }

    setDisabled(false)
  }

  return (
    <CForm
      className="row g-3 needs-validation"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}

    >
      

      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom01">Full Name</CFormLabel>
        <CFormInput type="text" id="validationCustom01" defaultValue={account.fullname} ref={fullname} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Date Of Birth</CFormLabel>
        <CFormInput type="date" id="validationCustom02" defaultValue={account.dob} ref={dob} required />
        {/* <DateTimePicker ref={dob} required/> */}
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Personal Email</CFormLabel>
        <CFormInput type="email" id="validationCustom02" defaultValue={account.email} ref={email} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Contact Phone Number</CFormLabel>
        <CFormInput type="number" id="validationCustom02" defaultValue={account.phone} ref={phone} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Address</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={account.address} ref={address} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Username</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={account.username} ref={username} required disabled/>
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Password (default: 123)</CFormLabel>
        <CFormInput type="text" id="validationCustom02" defaultValue={account.password} ref={password} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>
      <CCol md={12}>
        <CFormLabel htmlFor="validationCustom02">Avatar</CFormLabel>
        <AvatarUpload defualtImage={'http://127.0.0.1:8000/image/Accounts/unknown.jpg'} handleSingleFileBase64={handleSingleFileBase64} />
      </CCol>
      <CCol xs={12} className="d-flex justify-content-center">
        <CButton color="success" type="submit" disabled={disabled}>
          Confirm add
        </CButton>
      </CCol>
    </CForm>
  )
}

const StaffUpdate = ({account, handleTableChange, onClose }) => {
  return (
    <CustomForm account={account} handleTableChange={handleTableChange} onClose={onClose} />
  );
};

export default StaffUpdate;

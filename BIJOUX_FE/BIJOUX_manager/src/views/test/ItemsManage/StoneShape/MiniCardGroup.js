import React,{useState} from 'react'
import {
  CBreadcrumb,
  CBreadcrumbItem,
  CCard,
  CCardBody,
  CButton,
  CCol,
  CRow,
  CLink,
  CPopover
} from '@coreui/react'
import Items from '../../../component_items/miniCard/items'
import Modal_Button from '../../../component_items/Modal/ModalButton'
import UpdateForm from '../stone-form/UpdateForm'
import RemoveForm from '../stone-form/RemoveForm'

function Option(props) {
  
  return (
    <CCard>
      <Modal_Button  title={'Update stone shape id: ' + props.shape.id} content={'Update'} color="success" className="btn btn-primary">
        <UpdateForm shape={props.shape} />
      </Modal_Button>
      <Modal_Button  title={'Confirm remove stone'} content={'Remove'} color="danger" className="btn btn-primary">
        <RemoveForm shape={props.shape} />
      </Modal_Button>
    </CCard>
  )
}

const MiniCardGroup = ({ items }) => {
  const [visiblePopoverIndex, setVisiblePopoverIndex] = useState(null);

  const handlePopoverClick = (index) => {
    //alert(index)
    setVisiblePopoverIndex(index);
  };

  return (
    <CRow className="text-center">
      {items.map((item, index) => (
        <CPopover
          key={index}
          title="Popover title"
          content={<Option index={index} handlePopoverClick={handlePopoverClick} shape={item} />}
          placement="right"
          visible={visiblePopoverIndex === index}
          //onMouseEnter={() => handlePopoverToggle(index)}
          //onClick={() => handlePopoverClick(index)}
          //onMouseLeave={() => handlePopoverToggle(null)}
          trigger={ visiblePopoverIndex === index ? "click" : "manual"}
        >
          <CButton
            color="secondary"
            style={{ width: 'fit-content', height: 'fit-content' }}
            className='m-2 p-0'
            onClick={() => handlePopoverClick(index)}
          >
            <Items item={item} />
          </CButton>
        </CPopover>
      ))}
    </CRow>
  );
}

export default MiniCardGroup;

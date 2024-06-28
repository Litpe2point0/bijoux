import {
    CCard,
    CCardBody,
    CCardTitle,
    CCardText,
} from '@coreui/react'
import AvatarInput from '../../component_items/Avatar/Avatar'





const AccountCard = ({ account, avatarSize, cardHeight }) => {
    return (
        <CCard className="bg-light mb-3" style={{ height: `${cardHeight}` }}>

            <CCardBody className="d-flex align-items-center justify-content-around h-100">

                <AvatarInput size={avatarSize} src={account.imageUrl} />
                <div className="d-flex flex-column justify-content-around" style={{fontSize: '14px'}}>
                    <CCardTitle className="text-center fs-5 fw-bold text-dark">{account.fullname}</CCardTitle>
                    <div className="text-dark px-2 d-flex flex-column justify-content-between h-50">
                        <span ><b>Account ID:</b>  #{account.id}</span>
                        <span ><b>Email:</b> {account.email}</span>
                        <span ><b>Contact Number:</b> {account.phone}</span>
                    </div>
                </div>

            </CCardBody>
        </CCard>
    )

}
export default  AccountCard
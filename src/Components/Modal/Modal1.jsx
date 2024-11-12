
import { useState } from "react";
import PropTypes from "prop-types";
import "./Modal1.css";
import axios from 'axios';
import { FaTimes } from "react-icons/fa";
import logage from '/src/Components/assets/logage.png';
import headphone from '/src/Components/assets/headphone.png';
import smartwatch from '/src/Components/assets/smartwatch.png';
import sneakers from '../assets/sneakers.jpg'
import hoodie from '../assets/hoodie.jpg'
import vacuum from '../assets/vacuum.png'
import vacumCleaner from '../assets/vacumCleaner.png'
import greeenpod from '../assets/greenpod.png'

import { useTranslation } from 'react-i18next';


const Modal1 = ({ show, handleClose, user_level, amount, balance, orderCounts}) => {

  const { t } = useTranslation();
  const images = [greeenpod, logage, headphone, smartwatch, sneakers, hoodie, vacumCleaner, vacuum];

  const [currentImage, setCurrentImage] = useState(images[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [flashMessage, setFlashMessage] = useState(""); // State for flash message
  const [showFlashMessage, setShowFlashMessage] = useState(false); // State to control flash message visibility


  if (!show) return null;

  const djangoHostname = import.meta.env.VITE_DJANGO_HOSTNAME;
  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();
  const commissionAmount = amount * 0.2;

  function amount_order(){
    if(user_level === "VIP1"){
      return  10
    }
    if(user_level === "VIP2" && orderCounts == 0){
      return  40
    }
    if(user_level === "VIP2" && orderCounts == 1){
      return  20
    }
    if(user_level === "VIP3" && orderCounts == 0){
      return  70
    }
    if(user_level === "VIP3" && orderCounts == 1){
      return  120
    }
    if(user_level === "VIP3" && orderCounts == 2){
      return  200
    }
    if(user_level === "VIP3" && orderCounts == 3){
      return  500
    }
    if(user_level === "VIP3" && orderCounts == 4){
      return  900
    }
    if(user_level === "VIP3" && orderCounts == 5){
      return  1200
    }
    if(user_level === "VIP3" && orderCounts == 6){
      return  1500
    }
    if(user_level === "VIP3" && orderCounts == 7){
      return  2200
    }
    if(user_level === "VIP3" && orderCounts == 8){
      return  3000
    }
    if(user_level === "VIP3" && orderCounts == 9){
      return  3500
    }
    if(user_level === "VIP3" && orderCounts == 10){
      return  3950
    }
    if(user_level === "VIP3" && orderCounts == 11){
      return  4200
    }
    
  }

  function commission_order(){
    if(user_level === "VIP2" && orderCounts == 0){
      return  12
    }
    if(user_level === "VIP2" && orderCounts == 1){
      return  6
    }
    if(user_level === "VIP3" && orderCounts == 0){
      return  49
    }
    if(user_level === "VIP3" && orderCounts == 1){
      return  84
    }
    if(user_level === "VIP3" && orderCounts == 2){
      return  140
    }
    if(user_level === "VIP3" && orderCounts == 3){
      return  350
    }
    if(user_level === "VIP3" && orderCounts == 4){
      return  648
    }
    if(user_level === "VIP3" && orderCounts == 5){
      return  840
    }
    if(user_level === "VIP3" && orderCounts == 6){
      return  1050
    }
    if(user_level === "VIP3" && orderCounts == 7){
      return  1540
    }
    if(user_level === "VIP3" && orderCounts == 8){
      return  2100
    }
    if(user_level === "VIP3" && orderCounts == 9){
      return  2450
    }
    if(user_level === "VIP3" && orderCounts == 10){
      return  2765
    }
    if(user_level === "VIP3" && orderCounts == 11){
      return  2940
    }
  }

  const handlePay = async () => {

    // Change the image randomly
    
    
    if (balance >= amount) {
      const randomIndex = Math.floor(Math.random() * images.length);
      setCurrentImage(images[randomIndex]);
      
      setIsLoading(true);


      const authToken = localStorage.getItem('token'); 
      const user = localStorage.getItem('user_id');
      

      try {
        // Post request
        await axios.post(`${djangoHostname}/api/orders/order-grabbings/`, {
          order: 1,
          amount: amount,
          commission: commissionAmount
        }, {
          headers: {
            'Authorization': `Token ${authToken}`
          }
        });

        // Fetch user details
        const response = await axios.get(`${djangoHostname}/api/accounts/users/${user}/`, {
          headers: {
            'Authorization': `Token ${authToken}`
          }
        });

        const userLevel = response.data.level;
        const orderCount = response.data.grabbed_orders_count;

        setIsSuccess(true); // Set success state

        // Set flash message based on user level and order count
        if (userLevel === "VIP1" && orderCount === 1) {
          // setFlashMessage("Order completed. Grab two more");
          setFlashMessage(t("Grab_two_more"));
        } 
        if (userLevel === "VIP1" && orderCount === 2) {
          // setFlashMessage("Order completed. Grab one more");
          setFlashMessage(t("Grab_one_more"));
        }
        if (userLevel === "VIP1" && orderCount === 3) {
          // setFlashMessage("3 Orders completely Grabbed. Withdraw");
          setFlashMessage(t("Grab_3_more"));
        }
        if (userLevel === "VIP2" && orderCount === 1) {
          // setFlashMessage("Top up $20 for the next Order");
          setFlashMessage(t("next_Order"));
        }
        if (userLevel === "VIP2" && orderCount === 2) {
          // setFlashMessage("Orders completed. Withdraw.");
          setFlashMessage(t("completed_withdraw"));
        }
        if (userLevel === "VIP3" && orderCount === 1) {
          // setFlashMessage("Top up $120 for the next Order");
          setFlashMessage(t("Top_up_$120_next"));
        }
        if (userLevel === "VIP3" && orderCount === 2) {
          // setFlashMessage("Top up $200 for the next Order");
          setFlashMessage(t("Top_up_$200_next"));
        }
        if (userLevel === "VIP3" && orderCount === 3) {
          // setFlashMessage("Top up $500 for the next Order");
          setFlashMessage(t("Top_up_$500_next"));
        }
        if (userLevel === "VIP3" && orderCount === 4) {
          // setFlashMessage("Top up $900 for the next Order");
          setFlashMessage(t("Top_up_$900_next"));
        }
        if (userLevel === "VIP3" && orderCount === 5) {
          // setFlashMessage("Top up $1200 for the next Order");
          setFlashMessage(t("Top_up_$1200_next"));
        }
        if (userLevel === "VIP3" && orderCount === 6) {
          // setFlashMessage("Top up $1500 for the next Order");
          setFlashMessage(t("Top_up_$1500_next"));
        }
        if (userLevel === "VIP3" && orderCount === 7) {
          // setFlashMessage("Top up $2200 for the next Order");
          setFlashMessage(t("Top_up_$2200_next"));
        }
        if (userLevel === "VIP3" && orderCount === 8) {
          // setFlashMessage("Top up $3000 for the next Order");
          setFlashMessage(t("Top_up_$3000_next"));
        }
        if (userLevel === "VIP3" && orderCount === 9) {
          // setFlashMessage("Top up $3500 for the next Order");
          setFlashMessage(t("Top_up_$3500_next"));
        }
        if (userLevel === "VIP3" && orderCount === 10) {
          // setFlashMessage("Top up $3950 for the next Order");
          setFlashMessage(t("Top_up_$3950_next"));
        }
        if (userLevel === "VIP3" && orderCount === 11) {
          // setFlashMessage("Top up $4200 for the next Order");
          setFlashMessage(t("Top_up_$4200_next"));
        }
        if (userLevel === "VIP3" && orderCount === 12) {
          // setFlashMessage("Order Completed. Withdraw");
          setFlashMessage(t("completed_withdraw"));
        }
       

        setShowFlashMessage(true); // Show flash message

      } catch (error) {
        console.error("Error during payment:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle flash message confirmation
  const handleFlashMessageConfirm = () => {
    setShowFlashMessage(false);
    window.location.reload(); // Reload the page after confirmation
  };

  const isButtonDisabled = isLoading || isSuccess;


  // alert(user_level)
  // alert(orderCounts)
      
    // console.log(commission_order())
    // alert(commission_order())

  return (
    <div className="modal-overlay">
      <div className="modal-content py-5">
        <button onClick={handleClose} className="modal-close-btn">
          <FaTimes />
        </button>
        {/* Display the current image */}
        <div className="time text-end d-flex justify-content-evenly">
          <p>{t('date')}: {formattedDate}</p>
          <p>{t('time')}: {formattedTime}</p>
        </div>
        <div className="image-container">
          <img src={currentImage} alt="Grab items" className="img-fluid" style={{width: '200px', height:'200px', objectFit:'cover'}} />
        </div>
        <div className="d-flex justify-content-between px-4">
          <p className="pro-amount fw-bold fs-3">${}</p>
          <span className="fw-bold fs-3 mt-0">X2</span>
        </div>
        <div className="d-flex justify-content-between my-0 mx-2">
          <div>
            <p className="total-amount fw-bold">{t('total_order_amount')}</p>
            <p className="total-amount text-start fs-4 fw-bold mt-0">${amount_order()}</p>
          </div>
          <div>
            <h4 className="fw-bold commi">{t('commision')}</h4>
            <h4 className="fw-bold commi text-end">${commission_order()}</h4>
          </div>
        </div>

        {/* Flash message */}
        {showFlashMessage && (
          <div className="flash-message">
            <p>{flashMessage}</p>
            <button onClick={handleFlashMessageConfirm} className="btn btn-primary">OK</button>
          </div>
        )}
        

        <div className="modal-buttons pb-sm-5">
          <button
            onClick={handlePay}
            className="btn rounded-pill border-0 fs-4"
            disabled={isLoading || (balance < 20 && orderCounts < 1) || isSuccess}
          >
            {isLoading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : t('grab_2')}
          </button>
        </div>
      </div>
    </div>
  );
};

Modal1.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  user_level: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
};

export default Modal1;
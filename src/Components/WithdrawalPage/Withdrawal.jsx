import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import SliderToggle from "../SliderToggle/SliderToggle";
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Withdrawal.css';
// import { useTranslation } from 'react-i18next';


const Withdrawal = () => {

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulating a function that checks user authentication and type
    const token = localStorage.getItem("token");
    const user_type = localStorage.getItem("user_type");

    if (((user_type !== "client") && token)) {
      navigate("/login"); // Redirect to login page
    }
  }, [navigate]);

  // const { t } = useTranslation()
  const [selectedMethod, setSelectedMethod] = useState("crypto");
  const [amount, setAmount] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [userlevel, setUserLevel] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [cryptoWallet, setCryptoWallet] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawalPassword, setWithdrawalPassword] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [flashMessage, setFlashMessage] = useState(""); // New flash message state
  const [flashMessageType, setFlashMessageType] = useState(""); // New flash message type (success/error)

  const djangoHostname = import.meta.env.VITE_DJANGO_HOSTNAME;
  const user = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${djangoHostname}/api/accounts/users/${user}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setAvailableBalance(response.data.unsettle);
        setUserLevel(response.data.level);
        setAmount(response.data.unsettle); // Prepopulate the amount with availableBalance
        setOrderNumber(response.data.grabbed_orders_count); // Prepopulate the amount with availableBalance

        
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    fetchBalance();
  }, [djangoHostname]);


  const handleSubmit = async (e) => {

    e.preventDefault();

      // Validation for available Balance in unsettle
      if (
        (userlevel == "VIP2" && availableBalance < 60)
      ) {
        // setFlashMessage("You cannot withdraw, Please top up $20 and grab the second order");
        setFlashMessage(t("you_cannot_withdraw"));
        return;
      }
      // Validation for available Balance in unsettle
      if (
        (userlevel == "VIP3" && orderNumber < 11)
      ) {
        // setFlashMessage("You cannot withdraw, Please top and grab order");
        setFlashMessage(t("you_cannot_withdraw_2"));
        return;
      }

     // Validation for crypto
     if (
      (amount > availableBalance)
    ) {
      // setFlashMessage("You cannot withdraw more than your unsettlement amount");
      setFlashMessage(t("you_cannot_withdraw_3"));
      return;
    }
 

    // Validation for crypto
    if (
      selectedMethod === "crypto" &&
      (!amount || !cryptoWallet || !walletAddress || !withdrawalPassword)
    ) {
      // setFlashMessage("Please fill in all fields for crypto withdrawal");
      setFlashMessage(t("please_fill_in_all"));
      setFlashMessageType("error");
      return;
    }

    // Validation for bank
    if (
      selectedMethod === "bank" &&
      (!amount || !bankName || !bankAccountNumber || !phoneNumber || !withdrawalPassword)
    ) {
      // setFlashMessage("Please fill in all fields for bank withdrawal");
      setFlashMessage(t("please_fill_in_all_bank"));
      setFlashMessageType("error");
      return;
    }

    setLoading(true); // Start loading

    try {
      const token = localStorage.getItem("token");
      const user_phone = localStorage.getItem("phone");

      const requestData = {
        amount,
        withdrawalPassword,
        ...(selectedMethod === "crypto" && {
          bankName: cryptoWallet,
          bankAccountNumber: walletAddress,
          phoneNumber: user_phone,
          selectedMethod,
          user: user
        }),
        ...(selectedMethod === "bank" && {
          bankName,
          bankAccountNumber,
          phoneNumber,
          selectedMethod,
          user
        }),
      };

      await axios.post(`${djangoHostname}/api/withdrws/withdraw/`, requestData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // setFlashMessage("Request sent successfully.  Awaiting approval");
      setFlashMessage(t("Awaiting_approval"));
      setFlashMessageType("success");

      // handleUserUnsettle(user, availableBalance)
      
    } catch (error) {
      console.error("Error processing withdrawal:", error);
      // setFlashMessage("Error processing withdrawal");
      setFlashMessage(t("Error_processing_withdrawal"));
      setFlashMessageType("error");
    } finally {
      setWithdrawalPassword("")
      setWalletAddress("")
      setAmount("")
      setAvailableBalance("")
      setLoading(false); // Stop loading
      // Clear flash message after 5 seconds
      setTimeout(() => {
        setFlashMessage("");
      }, 5000);
    }
  };


  return (
    <div className="container">
      <div className="row my-5">
        <div className="col-auto">
          <Link to={"/homepage"}>
            <i className="bi bi-arrow-left fs-3 text-dark"></i>
          </Link>
        </div>
        <div className="col-auto mx-auto">
          <h1>{t('withdrawal')}</h1>
        </div>
      </div>
      <SliderToggle selectedMethod={selectedMethod} setSelectedMethod={setSelectedMethod} />
      
    
      
      <form
        className="px-2"
        onSubmit={handleSubmit}
        key={selectedMethod} // Force re-render when method changes
      >
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="withdrawal">
              {t('enter_amount')}
              </label>
              <input
                className="form-control py-3 border rounded-3 border-3"
                type="number"
                value={amount}
                // value={{availableBalance}}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="availableBalance">
              {t('avialable_withdrawal')}
              </label>
              <input
                type="number"
                className="form-control py-3 bg-secondary rounded-3 border border-0 avia-bal"
                value={availableBalance}
                // readOnly
              />
            </div>
          </div>
        </div>
        {selectedMethod === "crypto" && (
          <>
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="cryptowallet">
              {t('select_wallet')}
              </label>
              <select
                name="cryptowallet"
                id="cryptowallet"
                className="form-select py-3 border border-3"
                value={cryptoWallet}
                onChange={(e) => setCryptoWallet(e.target.value)}
                required
              >
                <option value="" selected>{t('Choose_wallet')}</option>
                <option value="USDT">USDT</option>
                <option value="BINANCE">BINANCE</option>
                <option value="TON">TON</option>
                <option value="BTC">BTC</option>
                <option value="TRX">TRX</option>
                <option value="TRC20">TRC20</option>
              </select>
            </div>
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="walletaddress">
              {t('recipient_wallet')}
              </label>
              <input
                type="text"
                className="form-control py-3 rounded-3 border border-3"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                required
              />
            </div>
          </>
        )}
        {selectedMethod === "bank" && (
          <>
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="bankname">
              {t('bank_name')}
              </label>
              <input
                type="text"
                name="bankname"
                className="form-control py-3 border border-3 rounded-3"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="accountNumber">
              {t('bank_account')}
              </label>
              <input
                type="number"
                className="form-control py-3 border border-3 rounded-3"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                required
              />
            </div>
            <div className="my-3">
              <label className="fw-bold fs-4 my-2" htmlFor="phonenumber">
              {t('Phone_number')}
              </label>
              <input
                type="tel"
                className="form-control py-3 rounded-3 border border-3"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
          </>
        )}
              <div className="my-3">
          <label className="fw-bold fs-4 my-2" htmlFor="withdrawalPassword">
          {t('enter_withdrawal_password')}
          </label>
          <input
            type="password"
            className="form-control py-3 rounded-3 border border-3"
            value={withdrawalPassword}
            onChange={(e) => setWithdrawalPassword(e.target.value)}
            required
          />
        </div>

        {flashMessage && ( // Flash message display
          <div className={`alert ${flashMessageType === 'success' ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
            {flashMessage}
          </div>
        )}

        <div className="my-4 text-center">
          <button
            className="btn rounded-pill py-2 w-75 border-0 draw-btn fw-bold text-light fs-5"
            type="submit"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              t('withdraw')
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

Withdrawal.propTypes = {
  selectedMethod: PropTypes.string,
  setSelectedMethod: PropTypes.func,
};

export default Withdrawal;

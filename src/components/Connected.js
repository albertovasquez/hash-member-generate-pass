import { getHashPass } from "../utility/hashpass";

const Connected = ({walletConnector, memberWallet, setGeneratingHashPass, setIsAuthenticated}) => {
  const generateHashPass = async () => {
    // Draft Message Parameters
    const message = "Generate a HASH Pass";
  
    const msgParams = [
      message,
      memberWallet
    ];

    // Sign personal message
    try {
      console.log(walletConnector);
      const result = await walletConnector.signPersonalMessage(msgParams);
      console.log(result);
      setGeneratingHashPass(true);
      await getHashPass(memberWallet, result)
      setGeneratingHashPass(false);
      // Close QR Code Modal
    } catch (error) {
      // Error returned when rejected
      console.error(error);
      localStorage.removeItem("walletconnect");
      setGeneratingHashPass(false);
    }
  }

  const prettyWallet = (wallet)  =>{
    if (!wallet) return '';
    return wallet.substring(0, 12) + "..." + wallet.substring(wallet.length - 12, wallet.length);
  }

  const walletconnectLogOut = async () => {
    try {
      walletConnector.killSession();
      localStorage.removeItem("walletconnect");
      setIsAuthenticated(false);
      setGeneratingHashPass(false);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (<>
    <label className="connected"> { prettyWallet(memberWallet) } </label>
    <p> <button className="btn btn-danger" onClick={generateHashPass}>Generar Pase</button> </p>
    <p className="description">Los pases solo puedes generar para el mismo dia</p>
    <button className="btn btn-secondary logout" onClick={walletconnectLogOut}>Desconectar</button>
  </>)
}

export default Connected;

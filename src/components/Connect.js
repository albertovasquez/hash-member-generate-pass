const Connect = ({walletConnector, WalletConnectQRCodeModal}) => {
  const walletconnectAuth = async () => {
    try {
      // create new session
      await walletConnector.createSession();
      const uri = walletConnector.uri;
      WalletConnectQRCodeModal.open(
        uri,
        () => {
          console.log("QR Code Modal closed");
        },
        true // isNode = true
      );
    } catch (ex) {
      console.log(ex);
    }
  };

  return (<>
        <label className="notRegistered">No estas conectado</label>
        <button onClick={walletconnectAuth} className="btn btn-danger">
          Conectar
        </button>
        <p className="description">Conecta tu wallet donde tiene tu NFT asociado a HASH HOUSE</p>
  </>)
}

export default Connect;
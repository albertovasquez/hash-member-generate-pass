import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Connect from "./components/Connect";
import Connected from "./components/Connected";
import { getNFTAccess } from "./utility/hashpass";

// Create connector
const walletConnector = new NodeWalletConnect(
  {
    bridge: "https://bridge.walletconnect.org", // Required
  },
  {
    clientMeta: {
      description: "HASHHOUSE Guest Pass Generator",
      url: "https://www.hashhouse.com/member/pass",
      icons: ["https://nodejs.org/static/images/logo.svg"],
      name: "WalletConnect",
    },
  }
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(walletConnector.connected);  
  const [generatingHashPass, setGeneratingHashPass] = useState(false);  
  const [memberWallet, setMemberWallet] = useState(null);  
  const [isMember, setIsMember] = useState(null);  
  const [isNFTAccess, setIsNFTAccess] = useState(null);  

  useEffect(() => {
    walletConnector.on("connect", async (error, payload) => {
      if (error) {
        throw error;
      }

      // Get provided accounts and chainId
      const { accounts } = payload.params[0];

      const members = await getNFTAccess(accounts[0]);
      const isWalletOwnNFT = (members.length > 0);
      if (isWalletOwnNFT) {
        setIsMember(isWalletOwnNFT[0].member);
        setIsNFTAccess(true);    
      }
      
      WalletConnectQRCodeModal.close();     

      if (!isWalletOwnNFT) {
        setIsAuthenticated(false);
        setMemberWallet(null);
        localStorage.removeItem("walletconnect");
        return;
      }

      setMemberWallet(accounts[0]);
      setIsAuthenticated(true);
    });
  
    walletConnector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
    
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      console.log('session updated', accounts, chainId)
    });
  
    walletConnector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log('disconnected', payload)
      localStorage.removeItem("walletconnect");
      setIsAuthenticated(false);
      setGeneratingHashPass(false);
    });

    (async () => {
      // Check if connection is already established
      if ( walletConnector.connected ) {        
        // create new session
        // await walletConnector.createSession();
        setMemberWallet(walletConnector.accounts[0]);
        setIsAuthenticated(true);
      }
    })();

  }, [setIsAuthenticated, setMemberWallet, setGeneratingHashPass]);

  return (
    <>
      <div id="left">
        <Header></Header>
        <div id="main">
        {generatingHashPass && (
          <div>
            <div>Generating HASH Pass</div>
          </div>
        )}

        {!isAuthenticated ? (
          <Connect walletConnector={walletConnector} WalletConnectQRCodeModal={WalletConnectQRCodeModal} />
        ) : (
          <Connected memberWallet={memberWallet} walletConnector={walletConnector} setIsAuthenticated={setIsAuthenticated} setGeneratingHashPass={setGeneratingHashPass} />        
        )}
        </div>
        <Footer></Footer>
      </div>
      <div id="right">
        <img alt="" className="agenda" src="./programacion.png" />
      </div>
    </>
  );
}

export default App;

const apiUrl = 'https://api.hashhouse.club';
// const apiUrl = 'http://localhost:3001';

export const getNFTAccess = async (wallet) => {
  const response = await fetch(`${apiUrl}/nfts/${wallet.toLowerCase()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'image/json',
    },
  });
  
  return response.json();
}

export const getHashPass = async (wallet, signature) => {
  console.log('getting hash pass with wallet:', wallet);
  const response = await fetch(`${apiUrl}/member?wallet=${wallet.toLowerCase()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'image/png',
      'HP-Wallet-Sig': signature
    },
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(
    new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `pass.png`,
  );

  // Append to html link element page
  document.body.appendChild(link);
  // Start download
  link.click();

  // Clean up and remove the link
  link.parentNode.removeChild(link);
}
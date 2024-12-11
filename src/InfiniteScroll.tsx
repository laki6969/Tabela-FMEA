import React, { useState} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const MyInfiniteScroll: React.FC = () => {
  const [items, setItems] = useState(Array.from({ length: 20 })); // Početni niz sa 20 elemenata

  const handleScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    if (event.currentTarget.scrollTop === 0) {
      console.log('Vratili ste se na vrh!');
    }
  };

  const fetchData = () => {
    console.log('Skrolovao/la si do kraja!'); // Ispis u konzoli kada se stigne do kraja
    setItems((prevItems) => [
      ...prevItems,
      ...Array.from({ length: 10 }), // Dodaj 10 novih elemenata
    ]);
  };

  return (
    <InfiniteScroll
      dataLength={items.length} // Obavezno: dužina trenutnih podataka
      next={fetchData} // Funkcija koja se zove kada se dođe do kraja
      hasMore={true} // Uvek omogućava više podataka (za testiranje)
      loader={<></>} // Prazna komponenta za loader
      //scrollThreshold={0.9} // Kada korisnik dođe na 90% liste, kreće učitavanje
      scrollableTarget="scrollableDiv" // Dodajemo target ID za kontejner
    >
      <div
        id="scrollableDiv"
        style={{
          height: '400px',
          overflow: 'auto',
          border: '1px solid gray',
        }}
        onScroll={handleScroll} // Dodavanje scroll eventa
      >
        {items.map((_, index) => (
          <div
            key={index}
            style={{
              border: '1px solid black',
              margin: '10px',
              padding: '10px',
              textAlign: 'center',
            }}
          >
            Element - #{index}
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
};

export default MyInfiniteScroll;

import React, { useState } from 'react';
import MuiToggleButton from "@mui/material/ToggleButton";
import { styled } from "@mui/material/styles";

const ToggleButton = styled(MuiToggleButton)({
    width: "100%",
    color: 'white',
    backgroundColor: '#B78D5A',
    fontSize: 16,
    textTransform: 'none',
    border: "1px solid #956829",
    borderRadius: 15,
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "white",
        backgroundColor: '#956829',
    },
    "&:not(.Mui-selected):hover": {
        color: 'white',
        backgroundColor: '#956829',
    },
    "&:hover": {
        backgroundColor: '#956829',
    },
});

const SelectProduct = ({ selectedButton, handleButtonClick }) => {

    return (
        <div className='bg-footer w-full flex flex-col justify-center items-center p-8 gap-4 rounded-xl shadow-lg'>
            <p className='manrope-regular text-black text-xl text-center max-w-[500px]'>Unlock <span className='text-primary'>5 to 8 pivotal insights, ideas, or concepts</span> extracted word by word from any book.</p>
            <div className='w-full flex gap-2 sm:gap-4 flex-col sm:flex-row manrope-semibold text-md sm:text-lg max-w-[200px] sm:max-w-none'>
                <ToggleButton
                    value={1}
                    selected={selectedButton === 1}
                    onClick={() => handleButtonClick(1)}
                    style={{
                        backgroundColor: selectedButton == null ? '#956829' : ''
                    }}
                >
                    Any 10 books from <br /> 1 category <br /> £29
                </ToggleButton>
                <ToggleButton
                    value={2}
                    selected={selectedButton === 2}
                    onClick={() => handleButtonClick(2)}
                    style={{
                        backgroundColor: selectedButton == null ? '#956829' : ''
                    }}
                >
                    Any 10 books from <br /> 1-3 categories <br /> £49
                </ToggleButton>
                <ToggleButton
                    value={3}
                    selected={selectedButton === 3}
                    onClick={() => handleButtonClick(3)}
                    style={{
                        backgroundColor: selectedButton == null ? '#956829' : ''
                    }}
                >
                    Any 30 books from <br /> any category <br /> £59
                </ToggleButton>
            </div>
            <p className='manrope-regular text-black text-sm text-center max-w-[500px]'>Downloadable as: PDF and Word</p>
        </div>
    )
}

export default SelectProduct;

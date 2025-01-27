import React, { useEffect, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import axios from 'axios';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import TimelapseIcon from '@mui/icons-material/Timelapse';
import TimerIcon from '@mui/icons-material/Timer';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDesign } from '../context/DesignContext';

export default function DesignPanel() {
    const { updateDesign } = useDesign();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const operatorId = searchParams.get('operatorId');

    const [icons, setIcons] = useState([]);
    const [colors, setColors] = useState([]);
    const [fonts, setFonts] = useState([]);
    const [fontSize, setFontSize] = useState([]);

    const [SelectedIcon, setSelectedIcon] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedFont, setSelectedFont] = useState('');
    const [selectedFontSize, setSelectedFontSize] = useState('');

    const iconOptions = [
        { name: 'HourglassEmptyIcon', component: <HourglassEmptyIcon /> },
        { name: 'TimelapseIcon', component: <TimelapseIcon /> },
        { name: 'TimerIcon', component: <TimerIcon /> }
    ];

    const colorOptions = [
        { name: 'Green', value: '#2fa362' },
        { name: 'Red', value: '#FF0000' },
        { name: 'Blue', value: '#0000FF' },
        { name: 'Black', value: '#000000' }
    ];

    const fontOptions = [
        { name: 'Arial', css: 'Arial, sans-serif' },
        { name: 'Roboto', css: 'Roboto, sans-serif' },
        { name: 'Times New Roman', css: '"Times New Roman", serif' },
        { name: 'Courier New', css: '"Courier New", monospace' },
        { name: 'Georgia', css: 'Georgia, serif' },
    ];

    const fontSizeOptions = [
        { name: 'Small', value: '12' },
        { name: 'Medium', value: '16' },
        { name: 'Large', value: '20' },
        { name: 'Extra Large', value: '24' },
    ];

    useEffect(() => {
        const fetchDesignOptions = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/operators/${operatorId}/design-configuration`);
                console.log('Fetched design configuration:', response.data.designConfig);
                const config = response.data.designConfig || {};
                setSelectedIcon(config.icon || '');
                setSelectedColor(config.color || '');
                setSelectedFont(config.font || '');
                setSelectedFontSize(config.fontSize || '');
                
                updateDesign({
                    primaryColor: config.color,
                    font: config.font,
                    icon: config.icon,
                    fontSize: config.fontSize
                });
            } catch (error) {
                console.error('Error fetching design options:', error);
            }
        }
        setIcons(iconOptions);
        setColors(colorOptions);
        setFonts(fontOptions);
        setFontSize(fontSizeOptions);

        fetchDesignOptions();
    }, []);

    const handleSave = async () => {
        if (!operatorId) {
            alert('Operator ID is missing. Cannot save configuration.');
        }
        const config = {
            icon: SelectedIcon,
            color: selectedColor,
            font: selectedFont,
            fontSize: selectedFontSize
        };
        console.log('config:', config);

        try {
            await axios.post('http://localhost:3001/api/operators/save-design', {
                operatorId,
                config
            });
            updateDesign({
                primaryColor: selectedColor,
                font: selectedFont,
                icon: SelectedIcon,
                fontSize: selectedFontSize
            })
            alert('Design configuration saved successfully!');
            console.log(config);
            navigate('/')
        } catch (error) {
            console.error('Error saving design configuration:', error);
            alert('Failed to save design configuration.');
        }
    };

    return (
        <Box p={3}>
            <Typography variant='h4' gutterBottom>
                Design Panel
            </Typography>

            <FormControl fullWidth margin='normal'>
                <InputLabel>Icon</InputLabel>
                <Select value={SelectedIcon} onChange={(e) => setSelectedIcon(e.target.value)}>
                    {icons.map((icon) => (
                        <MenuItem key={icon.name} value={icon.name}>
                            <Box display='flex' alignItems='center' gap={1}>
                                {icon.component}
                                {icon.name}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
                <InputLabel>Color</InputLabel>
                <Select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                    {colors.map((color) => (
                        <MenuItem key={color.name} value={color.value}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Box
                                    width={20}
                                    height={20}
                                    bgcolor={color.value}
                                    border="1px solid #000"
                                    borderRadius="50%"
                                />
                                {color.name}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
                <InputLabel>Font</InputLabel>
                <Select value={selectedFont} onChange={(e) => setSelectedFont(e.target.value)}>
                    {fonts.map((font) => (
                        <MenuItem key={font.name} value={font.css}>
                            <Box
                                fontFamily={font.css}
                            >
                                {font.name}
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
                <InputLabel>Font Size</InputLabel>
                <Select value={selectedFontSize} onChange={(e) => setSelectedFontSize(e.target.value)}>
                    {fontSize.map((fontSize) => (
                        <MenuItem key={fontSize.name} value={fontSize.value}>
                            {fontSize.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant='contained' color='primary' onClick={handleSave}>
                Save Design
            </Button>
        </Box>
    )
}

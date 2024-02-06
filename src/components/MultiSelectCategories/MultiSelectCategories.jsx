import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

/** This function creates a multiselect dropdown.
 * It takes in the current array of categories, the current selected categories, 
 * and a function to set the categories.
 */
export default function MultipleSelect({categories, categoriesValue, setCategories}) {
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const theme = useTheme();
const getStyles = (category, categoriesValue, theme) => {
  return {
    fontWeight:
      categoriesValue.indexOf(category) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setCategories(
      // On autofill we get a stringified value.
      typeof value === 'number' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="categoriesInput">Categories</InputLabel>
        <Select
          labelId="categoriesInput"
          id="categoriesSelector"
          multiple
          value={categoriesValue}
          onChange={handleChange}
          input={<OutlinedInput label="Categories" />}
          MenuProps={MenuProps}
        >
          {categories.map((category) => (
            <MenuItem
              key={category.id}
              value={category.id}
              style={getStyles(category.name, categoriesValue, theme)}
            >
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
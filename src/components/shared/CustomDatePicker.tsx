import moment from 'moment';
import React, {useState} from 'react';
import {Pressable, Text} from 'react-native';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';
import Style from '../Style';

type CustomDatePickerProps = DatePickerProps;

export const CustomDatePicker = ({
  date,
  onDateChange,
  ...rest
}: CustomDatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        style={[Style.datePicker, {justifyContent: 'center'}]}
        onPress={() => setOpen((open) => !open)}>
        <Text>{moment(date).format('Do MMMM YYYY')}</Text>
      </Pressable>
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          date && onDateChange?.(date);
        }}
        mode="date"
        onDateChange={onDateChange}
        onCancel={() => {
          setOpen(false);
        }}
        {...rest}
      />
    </>
  );
};

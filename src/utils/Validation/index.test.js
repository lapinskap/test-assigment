/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import validate from './index';
import '../../tests/setupTests';

describe('validate', () => {
  it('returns null on wrong validator', () => {
    const value1 = '12323';
    const validators = '';
    expect(validate(value1, validators))
      .toBe(null);
  });
  it('validates required', () => {
    const value1 = '12323';
    const value2 = '';
    const value3 = [1, 2];
    const value4 = [];
    const value5 = document.createElement('input', { type: 'file' }).files;
    const validators = ['required'];
    expect(validate(value1, validators))
      .toBe(null);
    expect(validate(value2, validators))
      .toBe('To pole jest wymagane');
    expect(validate(value3, validators))
      .toBe(null);
    expect(validate(value4, validators))
      .toBe('To pole jest wymagane');
    expect(validate(value5, validators))
      .toBe('To pole jest wymagane');
  });

  it('validates with minLength and required', () => {
    const value = '123';
    const validators = [{
      method: 'minLength',
      args: [3],
    }];
    expect(validate(value, validators))
      .toBe(null);
  });

  it('validates with minLength', () => {
    const value = '1';
    const validators = [{
      method: 'minLength',
      args: [3],
    }];
    expect(validate(value, validators))
      .toBe('Minimalna ilość znaków dla tego pola to 3');
  });

  it('validates with maxLength', () => {
    const value = '1';
    const value2 = '1234';
    const value3 = '';
    const validators = [{
      method: 'maxLength',
      args: [3],
    }];
    expect(validate(value, validators))
      .toBe(null);
    expect(validate(value2, validators))
      .toBe('Maksymalna ilość znaków dla tego pola to 3');
    expect(validate(value3, validators))
      .toBe(null);
  });

  it('validates with rangeRequiredFrom', () => {
    const value1 = null;
    const value2 = { from: '123' };
    const value3 = { from: '', to: '12343' };
    const validators = ['rangeRequiredFrom'];
    expect(validate(value1, validators)).toBe('{"from":"To pole jest wymagane","to":null}');
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).toBe('{"from":"To pole jest wymagane","to":null}');
  });

  it('validates with rangeRequiredFrom and returns null', () => {
    const value = {
      from: '20/03/2020',
      to: '30/03/2020',
    };
    const validators = ['rangeRequiredFrom'];
    expect(validate(value, validators))
      .toBe(null);
  });

  it('validates with rangeRequiredTo', () => {
    const value1 = null;
    const value2 = { to: '123' };
    const value3 = { from: '123', to: '' };
    const validators = ['rangeRequiredTo'];
    expect(validate(value1, validators))
      .toBe('{"from":null,"to":"To pole jest wymagane"}');
    expect(validate(value2, validators))
      .toBe(null);
    expect(validate(value3, validators))
      .toBe('{"from":null,"to":"To pole jest wymagane"}');
  });

  it('validates with rangeRequiredTo and returns null', () => {
    const value = {
      from: '20/03/2020',
      to: '30/03/2020',
    };
    const validators = ['rangeRequiredTo'];
    expect(validate(value, validators))
      .toBe(null);
  });

  it('validates with datetimeRequired', () => {
    const value1 = null;
    const value2 = { date: '20/03/2020' };
    const value3 = { time: '12:54' };
    const value4 = { date: '20/03/2020', time: '12:54' };
    const validators = ['datetimeRequired'];
    expect(validate(value1, validators))
      .toBe('{"date":"To pole jest wymagane","time":"To pole jest wymagane"}');
    expect(validate(value2, validators))
      .toBe('{"date":null,"time":"To pole jest wymagane"}');
    expect(validate(value3, validators))
      .toBe('{"date":"To pole jest wymagane","time":null}');
    expect(validate(value4, validators))
      .toBe(null);
  });

  it('validates with datetimeRequired and returns null', () => {
    const value = {
      date: '20/03/2020',
      time: '12:54',
    };
    const validators = ['datetimeRequired'];
    expect(validate(value, validators))
      .toBe(null);
  });

  it('validates with rangeRequiredBoth when range is missing', () => {
    const value1 = null;
    const value2 = { from: '20/03/2020' };
    const value3 = { to: '30/03/2020' };
    const value4 = { from: '20/03/2020', to: '30/03/2020' };
    const validators = ['rangeRequiredBoth'];
    expect(validate(value1, validators))
      .toBe('{"from":"To pole jest wymagane","to":"To pole jest wymagane"}');
    expect(validate(value2, validators))
      .toBe('{"from":null,"to":"To pole jest wymagane"}');
    expect(validate(value3, validators))
      .toBe('{"from":"To pole jest wymagane","to":null}');
    expect(validate(value4, validators))
      .toBe(null);
  });

  it('validates with rangeRequiredBoth and returns null', () => {
    const value = {
      from: '20/03/2020',
      to: '30/03/2020',
    };
    const validators = ['rangeRequiredBoth'];
    expect(validate(value, validators))
      .toBe(null);
  });

  it('validates correctly if value is equal to', () => {
    const value1 = 'test';
    const value2 = 'test-not-equal';
    const validators = [{
      method: 'mustBeEqual',
      args: ['test', 'Error Message'],
    }];
    expect(validate(value1, validators))
      .toBe(null);
    expect(validate(value2, validators))
      .toBe('Error Message');
  });

  it('validates ipv4', () => {
    const value1 = '123.123.123.123';
    const value2 = '123.277.123.123';
    const value3 = '';
    const validators = ['ipv4'];
    expect(validate(value1, validators))
      .toBe(null);
    expect(validate(value2, validators))
      .toBe('Nieprawidłowy adres IPv4');
    expect(validate(value3, validators))
      .toBe(null);
  });

  it('validates phone', () => {
    const value1 = '123456789';
    const value2 = '123-456-789';
    const value3 = '123 456 789';
    const value4 = '1234567';
    const value5 = '123r33454';
    const validators = ['phone'];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
    expect(validate(value5, validators)).not.toBe(null);
  });

  it('validates nip', () => {
    const value1 = '1234567890';
    const value2 = '1234567';
    const value3 = '12345678900';
    const value4 = 'r234567890';
    const validators = ['nip'];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).not.toBe(null);
    expect(validate(value3, validators)).not.toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
  });

  it('validates krs', () => {
    const value1 = '1234567890';
    const value2 = '1234567';
    const value3 = '12345678900';
    const value4 = 'r234567890';
    const validators = ['krs'];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).not.toBe(null);
    expect(validate(value3, validators)).not.toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
  });

  it('validates regon', () => {
    const value1 = '12345678900';
    const value2 = '1234567';
    const value3 = '123456789';
    const value4 = 'p234567890';
    const validators = ['regon'];
    expect(validate(value1, validators)).not.toBe(null);
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
  });

  it('validates postcode', () => {
    const incorrect1 = '12345';
    const incorrect2 = '123-43';
    const incorrect3 = '12-43';
    const incorrect4 = '12-4366';
    const incorrect5 = '12-a56';
    const correct = '12-890';
    const validators = ['postCode'];
    expect(validate(incorrect1, validators)).not.toBe(null);
    expect(validate(incorrect2, validators)).not.toBe(null);
    expect(validate(incorrect3, validators)).not.toBe(null);
    expect(validate(incorrect4, validators)).not.toBe(null);
    expect(validate(incorrect5, validators)).not.toBe(null);
    expect(validate(correct, validators)).toBe(null);
  });

  it('validates fax', () => {
    const value1 = '1234567877777777790';
    const value2 = '12345-67';
    const value3 = '123456:78900';
    const value4 = 'r234567890';
    const validators = ['fax'];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).not.toBe(null);
    expect(validate(value3, validators)).not.toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
  });

  it('validates email', () => {
    const value1 = 'test@test.pl';
    const value2 = 'test.test@test.pl';
    const value3 = 'test';
    const value4 = 'test@test';
    const validators = ['email'];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).not.toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
  });

  it('validate password', () => {
    const value1 = '';
    const value2 = '!Passóord124';
    const value3 = '!Qw3';
    const value4 = 'Aqweref3452';
    const value5 = '!QwR$#fgrdwe';
    const value6 = '!2QWERTYUI';
    const value7 = '!2asdfghjkl';
    const validators = ['password'];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).not.toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
    expect(validate(value5, validators)).not.toBe(null);
    expect(validate(value6, validators)).not.toBe(null);
    expect(validate(value7, validators)).not.toBe(null);
  });

  it('validate greaterEqualThan', () => {
    const value1 = '';
    const value2 = 4;
    const value3 = 5;
    const value4 = 6;
    const validators = [{
      method: 'greaterEqualThan',
      args: [5],
    }];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).not.toBe(null);
    expect(validate(value3, validators)).toBe(null);
    expect(validate(value4, validators)).toBe(null);
  });

  it('validate greaterThan', () => {
    const valid1 = '';
    const valid2 = 7;
    const invalid1 = 4;
    const invalid2 = 5;
    const validators = [{
      method: 'greaterThan',
      args: [5],
    }];
    expect(validate(valid1, validators)).toBe(null);
    expect(validate(valid2, validators)).toBe(null);
    expect(validate(invalid1, validators)).not.toBe(null);
    expect(validate(invalid2, validators)).not.toBe(null);
  });

  it('validate lessEqualThan', () => {
    const value1 = '';
    const value2 = 4;
    const value3 = 5;
    const value4 = 6;
    const validators = [{
      method: 'lessEqualThan',
      args: [5],
    }];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
  });

  it('validate allowedExtensions', () => {
    const valid1 = [{ name: 'test.csv' }];
    const valid2 = [{ name: 'test.csv' }, { name: 'test2.xls' }];
    const invalid1 = [{ name: 'test.csv.jpg' }];
    const invalid2 = [{ name: 'test.csv' }, { name: 'test2.png' }];
    const validators = [{
      method: 'allowedExtensions',
      args: [['csv', 'xls']],
    }];
    expect(validate(valid1, validators)).toBe(null);
    expect(validate(valid2, validators)).toBe(null);
    expect(validate(invalid1, validators)).not.toBe(null);
    expect(validate(invalid2, validators)).not.toBe(null);
  });

  it('validate url', () => {
    const valid1 = 'http://www.example.com/path?parm1=2';
    const valid2 = 'http://www.example.com/';
    const valid3 = 'http://example.com';
    const valid5 = 'www.example.com/';
    const invalid1 = 'testpl/path-to-resource';
    const invalid2 = '.test.pl/path-to-resource';
    const invalid3 = 'testpl';
    const invalid4 = 'http://www.example.';
    const invalid6 = 'test.pl/path-to-resource';
    const validators = ['url'];
    expect(validate(valid1, validators)).toBe(null);
    expect(validate(valid2, validators)).toBe(null);
    expect(validate(valid3, validators)).toBe(null);
    expect(validate(valid5, validators)).toBe(null);
    expect(validate(invalid1, validators)).not.toBe(null);
    expect(validate(invalid2, validators)).not.toBe(null);
    expect(validate(invalid3, validators)).not.toBe(null);
    expect(validate(invalid4, validators)).not.toBe(null);
    expect(validate(invalid6, validators)).not.toBe(null);
  });

  it('validate greaterEqualThan', () => {
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);

    const value1 = '';
    const value2 = yesterday;
    const value3 = today;
    const value4 = tomorrow;
    const validators = [{
      method: 'greaterEqualThanDate',
      args: [today],
    }];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).not.toBe(null);
    expect(validate(value3, validators)).toBe(null);
    expect(validate(value4, validators)).toBe(null);
    expect(validate(value4, [{
      method: 'greaterEqualThanDate',
      args: ['2010-09-01T00:00:00+00:00'],
    }])).toBe(null);
  });

  it('validate lessEqualThan', () => {
    const today = new Date();
    const yesterday = new Date();
    const tomorrow = new Date();
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);

    const value1 = '';
    const value2 = yesterday;
    const value3 = today;
    const value4 = tomorrow;
    const validators = [{
      method: 'lessEqualThanDate',
      args: [today],
    }];
    expect(validate(value1, validators)).toBe(null);
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value3, validators)).toBe(null);
    expect(validate(value4, validators)).not.toBe(null);
    expect(validate(value4, [{
      method: 'lessEqualThanDate',
      args: ['2010-09-01T00:00:00+00:00'],
    }])).not.toBe(null);
  });

  it('validate customValidation', () => {
    const value1 = 1;
    const value2 = 2;

    const callback = (arg) => {
      if (arg === value1) {
        return 'Test';
      }
      return null;
    };

    const validators = [{
      method: 'customValidation',
      args: [callback],
    }];
    expect(validate(value1, validators)).toBe('Test');
    expect(validate(value2, validators)).toBe(null);
    expect(validate(value1, {
      method: 'customValidation',
      args: [],
    })).toBe(null);
  });
});

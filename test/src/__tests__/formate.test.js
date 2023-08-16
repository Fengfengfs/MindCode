/**
 * tezign ownership
 * @owner chenqijin
 * @team M3
 */
import { formatMoney, formatDateToToDay, formateAudio, formateMoneyMonth } from '../formate';
import * as config from '@/store/config';

describe('formate funcs', () => {
  it('formatMoney-china', () => {
    jest.spyOn(config, 'getCurrentTypeBoolean').mockReturnValue(true);
    const moeny = 1000;
    const result = formatMoney(moeny);
    expect(result).toEqual({
      num: 10,
      unit: '元',
      icon: '¥'
    });
  });
  it('formatMoney-international', () => {
    jest.spyOn(config, 'getCurrentTypeBoolean').mockReturnValue(false);
    const moeny = 1000;
    const result = formatMoney(moeny);
    expect(result).toEqual({
      num: 10,
      unit: '元',
      icon: '¥'
    });
  });
  it('formatDateToToDay', () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01').getTime());
    const day30 = new Date('2022-01-31');
    const day0 = new Date('2022-01-01');
    const result = formatDateToToDay(day30);
    const result1 = formatDateToToDay(day0);
    expect(result).toBe(30);
    expect(result1).toBe(0);
  });

  it('formateMoneyMonth', () => {
    const testItem = {
      originalPrice: 36,
      price: 36
    };
    // 季度转换
    const result1 = formateMoneyMonth(testItem, 3);
    expect(result1).toEqual({
      ...testItem,
      transLate_originalPrice: 12,
      transLate_price: 12,
      unit: '季度'
    });
    // 年费转换
    const result2 = formateMoneyMonth(testItem, 12);
    expect(result2).toEqual({
      ...testItem,
      transLate_originalPrice: 3,
      transLate_price: 3,
      unit: '年'
    });
  });
});

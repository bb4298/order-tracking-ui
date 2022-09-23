import { useState, useCallback } from 'react';
import { Col, Row, Popover, Button, Input, Checkbox } from 'antd';
import { debounce } from 'lodash';

import { getPastISODateByMinutes } from '../../utils/stringUtils';

import { OrderStatuses, LateStatuses } from '../../constants/appConstant';


const { CREATED, ACCEPTED, DRIVERASSIGNED, DELIVERING } = OrderStatuses;
const { last5min, last10min, last15min, warningOrder, lateOrder } = LateStatuses;

const { Search } = Input;
type SearchAndFilterProps = {
	filter: any;
	searchField: string;
	filterOptions: any;
	placeholder: string;
	onUpdateFilter: Function;
};

const SearchAndFilter = (props: SearchAndFilterProps) => {
	const [searchValue, setsearchValue] = useState('');
	const [filterOptions, setFilterOptions] = useState(props.filterOptions);

	const handleFilterByPreviousTime = (selectedItem: any) => {
		const { filter } = props;
		if (selectedItem.value) {
			switch (selectedItem.key) {
				case last5min:
					return {
						...filter,
						updatedDate: { "$gte": getPastISODateByMinutes(5) }
					};
				case last10min:
					return {
						...filter,
						updatedDate: { "$gte": getPastISODateByMinutes(10) }
					};
				case last15min:
					return {
						...filter,
						updatedDate: { "$gte": getPastISODateByMinutes(15) }
					};
				case warningOrder: {
					delete filter.updatedDate;
					return {
						...filter,
						'$or': [
							{
								status: { '$in': [DELIVERING] },
								updatedDate: { "$gte": getPastISODateByMinutes(40), "$lt": getPastISODateByMinutes(30) }
							},
							{
								status: { '$in': [CREATED, ACCEPTED, DRIVERASSIGNED] },
								updatedDate: { "$gte": getPastISODateByMinutes(15), "$lt": getPastISODateByMinutes(10) },
							},
						]
					};
				}
				case lateOrder: {
					delete filter.updatedDate;
					return {
						...filter,
						'$or': [
							{

								status: { '$in': [DELIVERING] },
								updatedDate: { "$lt": getPastISODateByMinutes(40) }
							},
							{
								status: { '$in': [CREATED, ACCEPTED, DRIVERASSIGNED] },
								updatedDate: { "$lt": getPastISODateByMinutes(15) },
							},
						]
					};
				}
				default:
					return {
						...filter,
					};
			}
		} else {
			return {};
		}

	};

	const onChangeFilterOption = (selectedItem: any) => {
		const newFilter = filterOptions.map((item: any) => ({ ...item, value: item.key === selectedItem.key ? !item.value : false }));
		selectedItem.value = !selectedItem.value;
		setFilterOptions(newFilter);

		props.onUpdateFilter(handleFilterByPreviousTime(selectedItem));
	};

	const content = (
		<Row className={'ignor-margin'} style={{ width: '100%', height: 'auto', fontWeight: 'bold' }}>
			<Col span={24}>
				{filterOptions.map((item: any, index: number) => (
					<Row key={item.key} className={index === (filterOptions.length - 1) ? 'ignor-margin' : ''}> <Checkbox checked={item.value} onChange={() => { onChangeFilterOption(item); }}>{item.displayName}</Checkbox></Row>
				))}
			</Col>
		</Row>
	);

	// Wait 800ms before call api seach
	const onSearchUsingDebounce = useCallback(debounce((value) => props.onUpdateFilter(value), 800), []);

	const onChangeSearchValue = (event: any) => {
		const { filter, searchField } = props;
		setsearchValue(event.target.value);
		if (!event.target.value.trim()) {
			onSearchUsingDebounce({});
		} else {
			const filterParam = {
				...filter,
				searchField,
				searchText: event.target.value
			};
			onSearchUsingDebounce(filterParam);
		}
	};

	return (
		<Row>
			<Col span={4}>
				<Search value={searchValue} placeholder={props.placeholder} style={{ width: '100%' }} onChange={onChangeSearchValue} />
			</Col>
			<Col span={18}>

			</Col>
			<Col span={2}>
				<Popover placement="bottomRight" content={content} trigger="click">
					<Button>Filter</Button>
				</Popover>
			</Col>
		</Row>
	);
};

export default SearchAndFilter;

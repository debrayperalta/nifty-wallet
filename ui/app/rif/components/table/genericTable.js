import React, {Component} from 'react';
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';

/**
 * Generic table
 * https://www.npmjs.com/package/react-data-table-component
 */
export default class GenericTable extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    pagination: PropTypes.bool.isRequired,
    paginationSize: PropTypes.number.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
  }
  render() {
    const { columns, data, pagination, paginationSize, title, className } = this.props;
    return (
      <DataTable
        title={title}
        columns={columns}
        data={data}
        pagination={pagination}
        paginationPerPage={paginationSize}
        className={className}
      />
    )
  }
};
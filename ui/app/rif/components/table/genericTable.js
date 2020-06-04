import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useTable, usePagination } from 'react-table';
import Pagination from './pagination';

const Table = ({ title, columns, data, pageSize, displayColumnHeader, className }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: pageSize || 10 },
    },
    usePagination,
  );
  const classNames = className || {};
  return (
    <>
      {title &&
      <span className={classNames.title}>{title}</span>
      }
      <table className={classNames.table} {...getTableProps()}>
        { displayColumnHeader &&
          <thead className={classNames.thead}>
          {headerGroups.map(headerGroup => (
            <tr className={classNames.theadTr} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th className={classNames.theadTh} {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
          </thead>
        }
        <tbody className={classNames.tbody} {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <tr className={classNames.tbodyTr} {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td className={classNames.tbodyTd} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                );
              })}
            </tr>
          );
        })}
        </tbody>
      </table>
      <div>
        <Pagination
          pages={pageOptions.length}
          page={pageIndex}
          onPageChange={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          className={classNames.pagination}
        />
      </div>
    </>
  );
};

export default class GenericTable extends Component {
  static propTypes = {
    title: PropTypes.string,
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired,
    paginationSize: PropTypes.number.isRequired,
    displayColumnHeader: PropTypes.bool,
    className: PropTypes.any,
  };
  render () {
    const { title, columns, data, paginationSize, displayColumnHeader, className } = this.props;
    return <Table title={title} columns={columns} data={data} pageSize={paginationSize} displayColumnHeader={displayColumnHeader} className={className} />;
  }
}

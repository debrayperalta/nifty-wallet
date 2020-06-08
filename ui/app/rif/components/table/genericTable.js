import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { useTable, usePagination } from 'react-table';
import Pagination from './pagination';

const Table = ({ title, columns, data, pageSize, displayColumnHeader, classes }) => {
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
  const styles = classes || {};
  return (
    <>
      {title &&
      <span className={styles.title}>{title}</span>
      }
      {data.length > 0 &&
        <div>
          <table className={styles.table} {...getTableProps()}>
            {displayColumnHeader &&
            <thead className={styles.thead}>
            {headerGroups.map(headerGroup => (
              <tr className={styles.theadTr} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className={styles.theadTh} {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
            </thead>
            }
            <tbody className={styles.tbody} {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr className={styles.tbodyTr} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td className={styles.tbodyTd} {...cell.getCellProps()}>{cell.render('Cell')}</td>
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
            className={styles.pagination}
            />
          </div>
        </div>
      }
      {data.length === 0 &&
        <span className={styles.noData}>No data to display</span>
      }
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
    classes: PropTypes.any,
  };
  render () {
    const { title, columns, data, paginationSize, displayColumnHeader, classes } = this.props;
    return <Table title={title} columns={columns} data={data} pageSize={paginationSize} displayColumnHeader={displayColumnHeader} classes={classes} />;
  }
}

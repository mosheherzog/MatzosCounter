import React from 'react';
import axios from 'axios';
import Table from './table.jsx';
import Batches from './batces.jsx';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        row1: [],
        row2: [],
        batch: 0,
        shift: 1,
        winners: [],
        batches: []
    };
  }
  componentDidMount() {
		var _this = this;
    function getInfo() {
        _this.serverRequest = axios.get("/get-info")
        .then(result => {
            var data = result.data.members;
            var members = 0;
            var membersInTables = [];
            var numberOfTables = 3;

            data.forEach(function (member) {
                //populate the long array into smaller arries per table
                if (members % numberOfTables == 0) membersInTables[Math.floor(members / numberOfTables)] = [];
                membersInTables[Math.floor(members / numberOfTables)][members % numberOfTables] = member;
                members++;
            });
            _this.setState({
                row1: membersInTables.slice(0, membersInTables.length / 2),
                row2: membersInTables.slice(membersInTables.length / 2, membersInTables.length),
                batch: result.data.batch,
                shift: result.data.shift,
                winners: result.data.winners,
                batches: result.data.batches
            });
        }).catch(console.log);
      };
      getInfo();

      document.addEventListener('newData', getInfo);
    }
    componentWillUnmount() {
       this.serverRequest.abort();
     }
     render() {
       return(
       <div className="container">
         <div className="title-box">
            <h1>Matsot Counter</h1>
         </div>
         <Batches batches={this.state.batches}></Batches>
         <div className="main">
	         	<div className="header">
	            Current Batch: {this.state.batch} -  Current Shift: {this.state.shift}
	          </div>

	          <div className="row1">
              <div className="table top table-header">
                <div  className="row">
                  <div className="headers-cell cell">
                     Member Key:
                  </div>
                  <div className="headers-cell cell">
                      Current:
                  </div>
                  <div className="headers-cell cell">
                      Total:
                  </div>
                  <div className="headers-cell cell">
                     Avg:
                  </div>
                  <div className="headers-cell cell">
                     Avg Sec:
                  </div>
                  <div className="headers-cell cell">
                     Total 18:
                  </div>
                </div>
              </div>
	              {this.state.row1.map( (table, index) => {
										return (
	                  <Table position="top" order={index} members={table} key={index} winners={this.state.winners}></Table>
										)
	              })}
	          </div>
	        <div className="row2">
            <div className="table bot table-header">
              <div  className="row">
                <div className="headers-cell cell">
                   Member Key:
                </div>
                <div className="headers-cell cell">
                    Current:
                </div>
                <div className="headers-cell cell">
                    Total:
                </div>
                <div className="headers-cell cell">
                   Avg:
                </div>
                <div className="headers-cell cell">
                   Avg Sec:
                </div>
                <div className="headers-cell cell">
                   Total 18:
                </div>
              </div>
            </div>
	          {this.state.row2.map( (table, index) => {
							return (
								 <Table position="bot" order={index} members={table} key={index} winners={this.state.winners}></Table>
							)
	          })}
	        </div>
      </div>
    </div>
    )
     }
}

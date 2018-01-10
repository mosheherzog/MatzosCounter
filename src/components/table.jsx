import React from 'react';

export default class Table extends React.Component {
  render() {
  	return (
	       <div className={"table " + this.props.position + " table" + this.props.order}>

           {
             this.props.members.map( (member, index) => {
                var backClr = 'normal';
                //check if member is a winner
                var isWinner = this.props.winners.indexOf(member.current);
                if (isWinner > -1) {
                backClr = 'max' + (isWinner + 1);
                }

                return (
                  <div key={index} className="row">
                    <div className={"table-cell cell " + backClr}>
                        {member.key1}
                    </div>
                    <div className="table-cell cell normal">
                        {member.current|| 0}
                    </div>
                    <div className="table-cell cell normal">
                        {member.total|| 0}
                    </div>
                    <div className="table-cell cell normal">
                        {((Number(member.total)) / (Number(member.totalbatches)) || 0 ).toFixed(2) }
                    </div>
                    <div className="table-cell cell normal">
                        { Number(member.avrageseconds).toFixed(2)}
                    </div>
                    <div className="table-cell cell normal">
                        {member.totalbatches || 0}
                    </div>
                  </div>
                )
             })
           }
         </div>
       )
     }
  }

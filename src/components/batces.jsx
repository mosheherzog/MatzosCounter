import React from 'react';

export default class Batches extends React.Component {
  render() {
  	return (
	       <div className="side-panel">
           <div className="unit">
             <div className="cell side-cell side-header">
               Batch
             </div>
             <div className="cell side-cell side-header">
               Members
             </div>
           </div>
           {
             this.props.batches.map((batch, index) => {
               return (
                 <div className="unit" key={index}>
                   <div className="cell side-cell batch">
                     {batch.batch}
                   </div>
                   <div className="cell side-cell count">
                     {batch.countmembers}
                   </div>
                 </div>
               )
             })
           }
         </div>
       )
     }
  }

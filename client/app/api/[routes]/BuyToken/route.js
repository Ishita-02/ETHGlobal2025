import Web3Service from "@/components/services/Web3Service";
const Web3 = new Web3Service();


export const POST = async (req, res)=>{
    const {paymentAmount} = req.body();
    try{
      const response = await Web3.buyTokens(paymentAmount);
      if(!response){
        res.json({
            message : "response retuns here.."
        });

        return;
    }

    return res.json({
        message : response
    });

    }   
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
}

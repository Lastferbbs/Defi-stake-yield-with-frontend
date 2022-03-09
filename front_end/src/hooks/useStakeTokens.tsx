import { useEffect, useState } from "react"
import { useContractFunction, useEthers } from "@usedapp/core"
import TokenFarm from "../chain-info/contracts/TokenFarm.json"
import ERC20 from "../chain-info/contracts/MockDAI.json"
import networkMapping from "../chain-info/deployments/map.json"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"

export const useStakeTokens = (tokenAddress: string) => {

    // approve - address, abi, chainid
    const { chainId } = useEthers()
    const { abi } = TokenFarm
    const tokenFarmAddress = chainId ? networkMapping[String(chainId)]["TokenFarm"][0] : constants.AddressZero
    const tokenFarmInterface = new utils.Interface(abi)
    const tokenFarmContract = new Contract(tokenFarmAddress, tokenFarmInterface)

    const erc20ABI = ERC20.abi
    const erc20Interface = new utils.Interface(erc20ABI)
    const erc20Contract = new Contract(tokenAddress, erc20Interface)
    const { send: approveErc20Send, state: approveErc20State } = useContractFunction(erc20Contract, "approve", { transactionName: "Approve ERC20 transfer" })
    // stake
    const approveAndStake = (amount: string) => {
        setAmountToStake(amount)
        return approveErc20Send(tokenFarmAddress, amount)
    }

    const { send: stakeSend, state: stakeState } = useContractFunction(tokenFarmContract, "stakeTokens", { transactionName: "Stake Tokens" })
    const [amountToStake, setAmountToStake] = useState("0")

    useEffect(() => {
        if (approveErc20State.status == "Success") {
            stakeSend(amountToStake, tokenAddress)
        }
    }, [approveErc20State])
    const [state, setState] = useState(approveErc20State)

    useEffect(() => {
        if (approveErc20State.status == "Success") {
            setState(stakeState)
        } else {
            setState(approveErc20State)
        }
    }, [approveErc20State, stakeState])

    return { approveAndStake, state }
}